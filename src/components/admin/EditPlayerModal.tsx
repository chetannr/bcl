import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Upload, XCircle } from 'lucide-react';
import type { Player } from '../../lib/types';

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
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (player) {
      setName(player.name);
      setAge(player.age);
      setCategory(player.category);
      setPhone(player.phone);
      setPhotoUrl(player.photo_url);
      setPlayerType(player.player_type);
      setBasePrice(player.base_price.toString());
      setError('');
      // Reset upload state when player changes
      setUploadedFile(null);
      setUploadPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [player]);

  if (!player) {
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Clear URL input when file is selected
    setPhotoUrl('');
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPhotoToStorage = async (file: File, phoneNumber: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${phoneNumber.replace(/\D/g, '')}.${fileExt}`;
      const filePath = `players/${fileName}`;

      // Try to upload to Supabase Storage bucket 'player-photos'
      const { data, error: uploadError } = await supabase.storage
        .from('player-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.warn('[EditPlayerModal] Storage upload failed:', uploadError);
        // If storage bucket doesn't exist or upload fails, return null
        // The handleSave function will use the existing photo URL
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('player-photos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('[EditPlayerModal] Error uploading photo:', err);
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
      setIsUploading(true);
      let finalPhotoUrl = photoUrl.trim();

      // If a file was uploaded, upload it first
      if (uploadedFile) {
        console.log('[EditPlayerModal] Uploading photo to storage...');
        const uploadedUrl = await uploadPhotoToStorage(uploadedFile, phone.trim());
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl;
        } else {
          // If upload fails, keep the existing photo URL
          if (!finalPhotoUrl) {
            finalPhotoUrl = player.photo_url || '/assets/player-template.png';
          }
        }
      }

      // Use existing photo if no new photo URL or file provided
      if (!finalPhotoUrl) {
        finalPhotoUrl = player.photo_url || '/assets/player-template.png';
      }

      console.log('[EditPlayerModal] Updating player:', player.id);
      const { error: updateError } = await supabase
        .from('players')
        .update({
          name: name.trim(),
          age: age.trim(),
          category,
          phone: phone.trim(),
          photo_url: finalPhotoUrl,
          player_type: playerType,
          base_price: basePriceNum,
        })
        .eq('id', player.id);

      if (updateError) throw updateError;

      console.log('[EditPlayerModal] Player updated successfully');
      onSave();
      onClose();
    } catch (err: any) {
      console.error('[EditPlayerModal] Error updating player:', err);
      setError(err.message || 'Failed to update player');
    } finally {
      setIsUploading(false);
    }
  };

  const categories = ['Batsman', 'Bowler', 'All Rounder'];
  const playerTypes = ['Regular', 'Premium'];

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
