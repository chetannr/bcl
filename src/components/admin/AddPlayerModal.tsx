import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Upload, XCircle } from 'lucide-react';
import type { Database } from '../../lib/database.types';

interface AddPlayerModalProps {
  onClose: () => void;
  onSave: () => void;
}

export function AddPlayerModal({ onClose, onSave }: AddPlayerModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState('All Rounder');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [playerType, setPlayerType] = useState('Regular');
  const [basePrice, setBasePrice] = useState('2000');
  const [auctionSerialNumber, setAuctionSerialNumber] = useState('');
  const [isValidPlayer, setIsValidPlayer] = useState('Y');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [jerseyName, setJerseyName] = useState('');
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const { error: uploadError } = await supabase.storage
        .from('player-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.warn('[AddPlayerModal] Storage upload failed:', uploadError);
        // If storage bucket doesn't exist or upload fails, return null
        // The handleSave function will use the default template
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('player-photos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('[AddPlayerModal] Error uploading photo:', err);
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

    try {
      setIsUploading(true);
      let finalPhotoUrl = photoUrl.trim();

      // If a file was uploaded, upload it first
      if (uploadedFile) {
        console.log('[AddPlayerModal] Uploading photo to storage...');
        const uploadedUrl = await uploadPhotoToStorage(uploadedFile, phone.trim());
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl;
        } else {
          // Fallback to default if upload fails
          finalPhotoUrl = '/assets/player-template.png';
        }
      }

      // Use default if no photo URL or file provided
      if (!finalPhotoUrl) {
        finalPhotoUrl = '/assets/player-template.png';
      }

      console.log('[AddPlayerModal] Adding new player');
      const { error: insertError } = await supabase
        .from('players')
        .insert({
          name: name.trim(),
          age: age.trim() || null,
          category,
          phone: phone.trim(),
          photo_url: finalPhotoUrl,
          player_type: playerType,
          base_price: basePriceNum,
          status: 'unsold' as const,
          auction_serial_number: auctionSerialNumberNum,
          is_valid_player: isValidPlayer,
          jersey_number: jerseyNumberNum,
          jersey_name: jerseyName.trim() || null,
        } as Database['public']['Tables']['players']['Insert'] as never);

      if (insertError) throw insertError;

      console.log('[AddPlayerModal] Player added successfully');
      onSave();
      onClose();
      
      // Reset form
      setName('');
      setAge('');
      setCategory('All Rounder');
      setPhone('');
      setPhotoUrl('');
      setPlayerType('Regular');
      setBasePrice('2000');
      setAuctionSerialNumber('');
      setIsValidPlayer('Y');
      setJerseyNumber('');
      setJerseyName('');
      setUploadedFile(null);
      setUploadPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      console.error('[AddPlayerModal] Error adding player:', err);
      const error = err as { code?: string; message?: string };
      if (error.code === '23505') {
        setError('A player with this phone number already exists');
      } else {
        setError(error.message || 'Failed to add player');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const categories = ['Batsman', 'Bowler', 'All Rounder'];
  const playerTypes = ['Regular', 'ICON'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">Add New Player</h2>
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
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-neutral-500" />
                <span className="text-sm text-neutral-600">
                  {uploadedFile ? uploadedFile.name : 'Click to upload photo'}
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
            {isUploading ? 'Uploading...' : 'Add Player'}
          </button>
        </div>
      </div>
    </div>
  );
}
