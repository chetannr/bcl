import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Upload, XCircle } from 'lucide-react';

interface AddTeamModalProps {
  onClose: () => void;
  onSave: () => void;
}

export function AddTeamModal({ onClose, onSave }: AddTeamModalProps) {
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [baseBudget, setBaseBudget] = useState('100000');
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setLogoUrl('');
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadLogoToStorage = async (file: File, teamName: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const cleanedName = teamName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const fileName = `${cleanedName}.${fileExt}`;
      const filePath = `teams/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('team-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.warn('[AddTeamModal] Storage upload failed:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('team-logos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error('[AddTeamModal] Error uploading logo:', err);
      return null;
    }
  };

  const handleSave = async () => {
    setError('');

    if (!name.trim()) {
      setError('Team name is required');
      return;
    }

    const baseBudgetNum = parseFloat(baseBudget);
    if (isNaN(baseBudgetNum) || baseBudgetNum < 0) {
      setError('Base budget must be a valid number');
      return;
    }

    try {
      setIsUploading(true);
      let finalLogoUrl = logoUrl.trim();

      if (uploadedFile) {
        const uploadedUrl = await uploadLogoToStorage(uploadedFile, name.trim());
        if (uploadedUrl) {
          finalLogoUrl = uploadedUrl;
        } else {
          finalLogoUrl = '/assets/team-placeholder.png';
        }
      }

      if (!finalLogoUrl) {
        finalLogoUrl = '/assets/team-placeholder.png';
      }

      const { error: insertError } = await supabase
        .from('teams')
        .insert({
          name: name.trim(),
          logo_url: finalLogoUrl,
          base_budget: baseBudgetNum,
          current_balance: baseBudgetNum,
          players_count: 0,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          setError('A team with this name already exists');
        } else {
          throw insertError;
        }
        return;
      }

      onSave();
      onClose();
      
      setName('');
      setLogoUrl('');
      setBaseBudget('100000');
      setUploadedFile(null);
      setUploadPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('[AddTeamModal] Error adding team:', err);
      setError(err.message || 'Failed to add team');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">Add New Team</h2>
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
              Team Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter team name"
            />
          </div>

          {/* Logo Upload/URL */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Logo
            </label>
            
            {/* File Upload Section */}
            <div className="mb-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-neutral-500" />
                <span className="text-sm text-neutral-600">
                  {uploadedFile ? uploadedFile.name : 'Click to upload logo'}
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
                Logo URL
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setError('');
                  if (e.target.value.trim()) {
                    setUploadedFile(null);
                    setUploadPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }
                }}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="/assets/teams/team-logo.png"
                disabled={!!uploadedFile}
              />
            </div>

            {/* Preview */}
            {(uploadPreview || logoUrl) && (
              <div className="mt-3">
                <p className="text-xs text-neutral-500 mb-2">Preview:</p>
                <img
                  src={uploadPreview || logoUrl}
                  alt="Preview"
                  className="w-24 h-24 object-contain rounded-lg border border-neutral-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/team-placeholder.png';
                  }}
                />
              </div>
            )}
          </div>

          {/* Base Budget */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Base Budget
            </label>
            <input
              type="number"
              value={baseBudget}
              onChange={(e) => {
                setBaseBudget(e.target.value);
                setError('');
              }}
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="100000"
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
            disabled={!name.trim() || isUploading}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Add Team'}
          </button>
        </div>
      </div>
    </div>
  );
}
