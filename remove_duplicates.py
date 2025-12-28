#!/usr/bin/env python3
"""
Script to detect and remove exact duplicate images from a directory.
Keeps the highest quality version of each duplicate set.
"""

import hashlib
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple
from collections import defaultdict
from PIL import Image


def calculate_file_hash(filepath: Path) -> str:
    """Calculate MD5 hash of a file."""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def get_image_info(filepath: Path) -> Tuple[int, int, int]:
    """
    Get image information: width, height, and file size.
    Returns: (width, height, file_size)
    """
    try:
        with Image.open(filepath) as img:
            width, height = img.size
        file_size = filepath.stat().st_size
        return (width, height, file_size)
    except Exception as e:
        print(f"Warning: Could not read image info for {filepath}: {e}")
        return (0, 0, filepath.stat().st_size)


def get_filename_priority(filepath: Path) -> int:
    """
    Calculate filename priority. Lower number = higher priority.
    Files without suffix (e.g., '123.jpg') have higher priority than '123-1.jpg'
    """
    stem = filepath.stem
    # If filename ends with -1, -2, etc., it has lower priority
    if '-' in stem:
        parts = stem.split('-')
        if parts[-1].isdigit():
            return int(parts[-1]) + 1
    return 0


def select_best_quality(files: List[Path]) -> Path:
    """
    Select the best quality image from a list of duplicates.
    Priority: highest resolution -> largest file size -> simplest filename
    """
    if len(files) == 1:
        return files[0]
    
    # Get info for all files
    file_info = []
    for f in files:
        width, height, size = get_image_info(f)
        priority = get_filename_priority(f)
        file_info.append({
            'path': f,
            'resolution': width * height,
            'size': size,
            'priority': priority,
            'width': width,
            'height': height
        })
    
    # Sort by: resolution (desc), file size (desc), filename priority (asc)
    file_info.sort(key=lambda x: (-x['resolution'], -x['size'], x['priority']))
    
    return file_info[0]['path']


def find_duplicates(directory: Path) -> Dict[str, List[Path]]:
    """
    Find all duplicate images in a directory based on file hash.
    Returns: Dictionary mapping hash -> list of file paths
    """
    hash_map = defaultdict(list)
    
    # Only process .jpg files
    jpg_files = list(directory.glob("*.jpg")) + list(directory.glob("*.jpeg"))
    
    print(f"Scanning {len(jpg_files)} image files...")
    
    for filepath in jpg_files:
        if filepath.is_file():
            file_hash = calculate_file_hash(filepath)
            hash_map[file_hash].append(filepath)
    
    # Filter to only duplicates (hash with more than one file)
    duplicates = {k: v for k, v in hash_map.items() if len(v) > 1}
    
    return duplicates


def format_size(bytes: int) -> str:
    """Format bytes to human readable size."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.2f} TB"


def main():
    # Check for --yes flag
    auto_confirm = '--yes' in sys.argv or '-y' in sys.argv
    
    output_dir = Path(__file__).parent / "output"
    
    if not output_dir.exists():
        print(f"Error: Directory {output_dir} does not exist")
        return
    
    print("=" * 80)
    print("DUPLICATE IMAGE DETECTION AND REMOVAL")
    print("=" * 80)
    print()
    
    # Find duplicates
    duplicates = find_duplicates(output_dir)
    
    if not duplicates:
        print("✓ No duplicate images found!")
        return
    
    print(f"Found {len(duplicates)} groups of duplicate images\n")
    
    # Analyze each duplicate group
    files_to_delete = []
    total_space_to_free = 0
    
    for idx, (file_hash, files) in enumerate(duplicates.items(), 1):
        print(f"\nDuplicate Group {idx} ({len(files)} files):")
        print("-" * 60)
        
        # Select best quality file
        best_file = select_best_quality(files)
        best_info = get_image_info(best_file)
        
        print(f"  KEEP: {best_file.name}")
        print(f"        Resolution: {best_info[0]}x{best_info[1]}")
        print(f"        Size: {format_size(best_info[2])}")
        print()
        
        # Mark others for deletion
        for f in files:
            if f != best_file:
                info = get_image_info(f)
                print(f"  DELETE: {f.name}")
                print(f"          Resolution: {info[0]}x{info[1]}")
                print(f"          Size: {format_size(info[2])}")
                files_to_delete.append(f)
                total_space_to_free += info[2]
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total duplicate groups: {len(duplicates)}")
    print(f"Files to keep: {len(duplicates)}")
    print(f"Files to delete: {len(files_to_delete)}")
    print(f"Space to free: {format_size(total_space_to_free)}")
    print()
    
    # Confirm deletion
    if files_to_delete:
        if auto_confirm:
            response = 'yes'
            print("Auto-confirming deletion (--yes flag provided)")
        else:
            response = input("Do you want to proceed with deletion? (yes/no): ").strip().lower()
        
        if response in ['yes', 'y']:
            print("\nDeleting files...")
            deleted_count = 0
            for f in files_to_delete:
                try:
                    f.unlink()
                    print(f"  ✓ Deleted: {f.name}")
                    deleted_count += 1
                except Exception as e:
                    print(f"  ✗ Error deleting {f.name}: {e}")
            
            print(f"\n✓ Successfully deleted {deleted_count} duplicate files")
            print(f"✓ Freed {format_size(total_space_to_free)} of disk space")
        else:
            print("\nDeletion cancelled. No files were removed.")
    

if __name__ == "__main__":
    main()
