import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Upload, XCircle } from 'lucide-react';
import type { Player } from '../../lib/types';
import type { Database } from '../../lib/database.types';

interface EditPlayerModalProps {
  player: Player | null;
  onClose: () => void;
  onSave: () => void;
}

export function EditPlayerModal({ player, onClose, onSave }: EditPlayerModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState('All Rounder');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [playerType, setPlayerType] = useState('Regular');
  const [basePrice, setBasePrice] = useState('');
  const [auctionSerialNumber, setAuctionSerialNumber] = useState('');
  const [isValidPlayer, setIsValidPlayer] = useState('Y');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [jerseyName, setJerseyName] = useState('');
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (player) {
      console.log('[EditPlayerModal] Player loaded, initializing form:', {
        playerId: player.id,
        playerName: player.name,
        currentPhotoUrl: player.photo_url,
      });
      setName(player.name);
      setAge(player.age);
      setCategory(player.category);
      setPhone(player.phone);
      setPhotoUrl(player.photo_url);
      setPlayerType(player.player_type);
      setBasePrice(player.base_price.toString());
      setAuctionSerialNumber(player.auction_serial_number?.toString() || '');
      setIsValidPlayer(player.is_valid_player || 'Y');
      setJerseyNumber(player.jersey_number?.toString() || '');
      setJerseyName(player.jersey_name || '');
      setError('');
      // Reset upload state when player changes
      setUploadedFile(null);
      setUploadPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      console.log('[EditPlayerModal] Form initialized with player data');
    }
  }, [player]);

  if (!player) {
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('[EditPlayerModal] No file selected');
      return;
    }

    console.log('[EditPlayerModal] File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.warn('[EditPlayerModal] Invalid file type:', file.type);
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.warn('[EditPlayerModal] File too large:', file.size);
      setError('Image size must be less than 5MB');
      return;
    }

    console.log('[EditPlayerModal] File validation passed, setting up preview');
    setUploadedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('[EditPlayerModal] Preview created successfully');
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Clear URL input when file is selected
    setPhotoUrl('');
    console.log('[EditPlayerModal] Photo URL cleared, ready for file upload');
  };

  const handleRemoveFile = () => {
    console.log('[EditPlayerModal] Removing uploaded file');
    setUploadedFile(null);
    setUploadPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log('[EditPlayerModal] File removed, can now use URL input');
  };

  const uploadPhotoToStorage = async (file: File, phoneNumber: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const cleanedPhone = phoneNumber.replace(/\D/g, '');
      const fileName = `${cleanedPhone}.${fileExt}`;
      const filePath = `players/${fileName}`;

      console.log('[EditPlayerModal] Starting upload to Supabase Storage:', {
        originalFileName: file.name,
        fileExtension: fileExt,
        phoneNumber: phoneNumber,
        cleanedPhone: cleanedPhone,
        fileName: fileName,
        filePath: filePath,
        bucket: 'player-photos',
        fileSize: file.size,
        fileType: file.type,
      });

      // Try to upload to Supabase Storage bucket 'player-photos'
      console.log('[EditPlayerModal] Calling supabase.storage.upload...');
      const { data, error: uploadError } = await supabase.storage
        .from('player-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('[EditPlayerModal] Storage upload failed:', {
          error: uploadError,
          message: uploadError.message,
          name: uploadError.name,
        });
        // If storage bucket doesn't exist or upload fails, return null
        // The handleSave function will use the existing photo URL
        return null;
      }

      console.log('[EditPlayerModal] Upload successful!', {
        data: data,
        path: data?.path,
      });

      // Get public URL
      console.log('[EditPlayerModal] Getting public URL for:', filePath);
      const { data: urlData } = supabase.storage
        .from('player-photos')
        .getPublicUrl(filePath);

      console.log('[EditPlayerModal] Public URL retrieved:', {
        publicUrl: urlData.publicUrl,
        urlData: urlData,
      });

      return urlData.publicUrl;
    } catch (err) {
      console.error('[EditPlayerModal] Exception during photo upload:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
      return null;
    }
  };

  const handleSave = async () => {
    setError('');

    if (!name.trim()) {
      setError('Player name is required');
      return;
    }

    if (!category) {
      setError('Category is required');
      return;
    }

    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    const basePriceNum = parseFloat(basePrice);
    if (isNaN(basePriceNum) || basePriceNum < 0) {
      setError('Base price must be a valid number');
      return;
    }

    try {
      console.log('[EditPlayerModal] ===== Starting Save Process =====');
      console.log('[EditPlayerModal] Player ID:', player.id);
      console.log('[EditPlayerModal] Current state:', {
        hasUploadedFile: !!uploadedFile,
        photoUrl: photoUrl,
        currentPlayerPhotoUrl: player.photo_url,
        phone: phone.trim(),
      });

      setIsUploading(true);
      let finalPhotoUrl = photoUrl.trim();

      // If a file was uploaded, upload it first
      if (uploadedFile) {
        console.log('[EditPlayerModal] File upload detected, starting upload process...');
        console.log('[EditPlayerModal] Uploaded file details:', {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.type,
        });
        
        const uploadedUrl = await uploadPhotoToStorage(uploadedFile, phone.trim());
        
        if (uploadedUrl) {
          console.log('[EditPlayerModal] ✅ Upload successful! Using uploaded URL:', uploadedUrl);
          finalPhotoUrl = uploadedUrl;
        } else {
          console.warn('[EditPlayerModal] ⚠️ Upload failed, falling back to existing photo');
          // If upload fails, keep the existing photo URL
          if (!finalPhotoUrl) {
            finalPhotoUrl = player.photo_url || '/assets/player-template.png';
            console.log('[EditPlayerModal] Using existing player photo URL:', finalPhotoUrl);
          } else {
            console.log('[EditPlayerModal] Using manually entered photo URL:', finalPhotoUrl);
          }
        }
      } else {
        console.log('[EditPlayerModal] No file uploaded, checking photo URL input...');
        if (photoUrl.trim()) {
          console.log('[EditPlayerModal] Using manually entered photo URL:', photoUrl.trim());
          finalPhotoUrl = photoUrl.trim();
        } else {
          console.log('[EditPlayerModal] No new photo provided, keeping existing photo');
        }
      }

      // Use existing photo if no new photo URL or file provided
      if (!finalPhotoUrl) {
        finalPhotoUrl = player.photo_url || '/assets/player-template.png';
        console.log('[EditPlayerModal] No new photo, using existing/default:', finalPhotoUrl);
      }

      console.log('[EditPlayerModal] Final photo URL to save:', finalPhotoUrl);
      console.log('[EditPlayerModal] Updating player in database...');
      
      const auctionSerialNumberNum = auctionSerialNumber.trim() ? parseInt(auctionSerialNumber.trim(), 10) : null;
      if (auctionSerialNumber.trim() && (isNaN(auctionSerialNumberNum!) || auctionSerialNumberNum! < 0)) {
        setError('Auction Serial Number must be a valid positive number');
        return;
      }

      const jerseyNumberNum = jerseyNumber.trim() ? parseInt(jerseyNumber.trim(), 10) : null;
      if (jerseyNumber.trim() && (isNaN(jerseyNumberNum!) || jerseyNumberNum! < 0)) {
        setError('Jersey Number must be a valid positive number');
        return;
      }

      const updateData = {
        name: name.trim(),
        age: age.trim() || undefined,
        category,
        phone: phone.trim(),
        photo_url: finalPhotoUrl,
        player_type: playerType,
        base_price: basePriceNum,
        auction_serial_number: auctionSerialNumberNum,
        is_valid_player: isValidPlayer,
        jersey_number: jerseyNumberNum,
        jersey_name: jerseyName.trim() || undefined,
      } as Database['public']['Tables']['players']['Update'];
      
      console.log('[EditPlayerModal] Update data:', updateData);
      
      const playersQuery = supabase.from('players') as unknown as {
        update: (values: Database['public']['Tables']['players']['Update']) => {
          eq: (column: 'id', value: string) => Promise<{ 
            error: (Error & { code?: string; details?: string; hint?: string }) | null;
          }>;
        };
      };
      const { error: updateError } = await playersQuery
        .update(updateData)
        .eq('id', player.id);

      if (updateError) {
        console.error('[EditPlayerModal] ❌ Database update failed:', {
          error: updateError,
          message: updateError.message,
          code: updateError.code,
          details: updateError.details,
          hint: updateError.hint,
        });
        throw updateError;
      }

      console.log('[EditPlayerModal] ✅ Player updated successfully in database!');
      console.log('[EditPlayerModal] ===== Save Process Complete =====');
      onSave();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update player';
      const errorDetails = err instanceof Error ? {
        error: err,
        message: err.message,
        stack: err.stack,
      } : {
        error: err,
      };
      
      console.error('[EditPlayerModal] ❌ Error in save process:', errorDetails);
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      console.log('[EditPlayerModal] Upload state reset');
    }
  };

  const categories = ['Batsman', 'Bowler', 'All Rounder'];
  const playerTypes = ['Regular', 'ICON'];


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">Edit Player</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Player Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter player name"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Age
            </label>
            <input
              type="text"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 25 years"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Phone Number *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter phone number"
            />
          </div>

          {/* Photo Upload/URL */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Photo
            </label>
            
            {/* File Upload Section */}
            <div className="mb-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload-edit"
              />
              <label
                htmlFor="photo-upload-edit"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-neutral-500" />
                <span className="text-sm text-neutral-600">
                  {uploadedFile ? uploadedFile.name : 'Click to upload new photo'}
                </span>
              </label>
              {uploadedFile && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="mt-2 flex items-center gap-1 text-sm text-danger-600 hover:text-danger-700"
                >
                  <XCircle className="w-4 h-4" />
                  Remove file
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">OR</span>
              </div>
            </div>

            {/* URL Input Section */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Photo URL
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  setError('');
                  // Clear uploaded file when URL is entered
                  if (e.target.value.trim()) {
                    setUploadedFile(null);
                    setUploadPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }
                }}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="/assets/players/phone.jpg"
                disabled={!!uploadedFile}
              />
            </div>

            {/* Preview */}
            {(uploadPreview || photoUrl) && (
              <div className="mt-3">
                <p className="text-xs text-neutral-500 mb-2">Preview:</p>
                <img
                  src={uploadPreview || photoUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-neutral-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/player-template.png';
                  }}
                />
              </div>
            )}
          </div>

          {/* Player Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Player Type
            </label>
            <select
              value={playerType}
              onChange={(e) => {
                setPlayerType(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {playerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Base Price
            </label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => {
                setBasePrice(e.target.value);
                setError('');
              }}
              min="0"
              step="100"
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="2000"
            />
          </div>

          {/* Auction Serial Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Auction Serial Number
            </label>
            <input
              type="number"
              value={auctionSerialNumber}
              onChange={(e) => {
                setAuctionSerialNumber(e.target.value);
                setError('');
              }}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter auction serial number"
            />
          </div>

          {/* Is Valid Player */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Is Valid Player
            </label>
            <select
              value={isValidPlayer}
              onChange={(e) => {
                setIsValidPlayer(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>

          {/* Jersey Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Jersey Number
            </label>
            <input
              type="number"
              value={jerseyNumber}
              onChange={(e) => {
                setJerseyNumber(e.target.value);
                setError('');
              }}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter jersey number"
            />
          </div>

          {/* Jersey Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Jersey Name
            </label>
            <input
              type="text"
              value={jerseyName}
              onChange={(e) => {
                setJerseyName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter jersey name"
            />
          </div>

          {/* Status Info */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="text-sm text-neutral-600 mb-1">Current Status</div>
            <div className="text-lg font-semibold text-neutral-900">
              {player.status === 'sold' ? 'SOLD' : player.status === 'bidding' ? 'BIDDING' : 'UNSOLD'}
            </div>
            {player.status === 'sold' && (
              <div className="text-sm text-neutral-500 mt-1">
                To mark as unsold, delete the transaction in the Transactions table above
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-danger-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !category || !phone.trim() || isUploading}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
