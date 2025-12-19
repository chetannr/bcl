# BCL Player Profile Photo Extractor

This script extracts profile photos and player information from BCL PowerPoint presentations.

## Features

- ✅ Extracts profile photos from all .pptx files in the directory
- ✅ Saves images with mobile number as filename (e.g., `9611999614.jpg`)
- ✅ Handles duplicate phone numbers with suffixes (e.g., `9611999614-1.jpg`, `9611999614-2.jpg`)
- ✅ Creates JSON file with unique player entries
- ✅ Extracts player data: Name, Age, Category, Phone
- ✅ Comprehensive error handling and progress tracking

## Requirements

```bash
pip install python-pptx Pillow
```

## Usage

Simply run the script from the bcl directory:

```bash
cd bcl
python extract_players.py
```

The script will:
1. Scan all .pptx files in the current directory
2. Extract top-left positioned images from each slide
3. Parse player information (Name, Age, Category, Phone) from slide text
4. Save images to `output/` folder
5. Create `players_data.json` with unique player records

## Output Structure

```
bcl/
├── extract_players.py
├── output/
│   ├── 9611999614.jpg
│   ├── 9880616057.jpg
│   ├── 9611999614-1.jpg  (duplicate phone number)
│   ├── 9611999614-2.jpg  (another duplicate)
│   └── players_data.json
└── *.pptx (PowerPoint files)
```

## JSON Format

```json
[
  {
    "Name": "Arya",
    "Age": "30 years",
    "Category": "All Rounder",
    "Ph": "9611999614"
  },
  {
    "Name": "Likith Reddy",
    "Age": "18 years",
    "Category": "Bowler",
    "Ph": "9880616057"
  }
]
```

## Latest Extraction Results

**Files processed:** 8 PowerPoint files
- 2023-BCL-Players.pptx
- 2024-BCL-Players.pptx
- 3-Oct-2025-New-2025-BCL-Players.pptx
- 4-Oct-2025-Re-Auction-2025-BCL-Players.pptx
- 4-Oct-2025-UnSold-Re-Auction-2025-BCL-Players.pptx
- Copy of 2024-BCL-Players.pptx
- Copy of New-2025-BCL-Players.pptx
- New-2024-BCL-Players (1).pptx

**Statistics:**
- Total slides processed: 923
- Total images extracted: 893
- Unique players: 157
- Duplicate phone numbers handled: 736
- No errors encountered

## Data Completeness

- Players with names: 97 (62%)
- Players with age: 151 (96%)
- Players with category: 151 (96%)
- All players have phone numbers: 157 (100%)

## Notes

- The script automatically handles missing data by leaving fields empty
- Duplicate detection is based solely on phone numbers
- Images are saved in JPEG format with 95% quality
- The top-left positioned image from each slide is extracted as the profile photo
- Phone numbers must be 10 digits to be recognized
