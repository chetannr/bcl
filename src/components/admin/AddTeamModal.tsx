import { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { X } from 'lucide-react';
import { getAssetPath } from '../../utils/assets';

interface AddTeamModalProps {
  onClose: () => void;
  onSave: () => void;
}

export function AddTeamModal({ onClose, onSave }: AddTeamModalProps) {
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [baseBudget, setBaseBudget] = useState('100000');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const addTeam = useMutation(api.mutations.addTeam);

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
      setIsSaving(true);
      const finalLogoUrl = logoUrl.trim() || getAssetPath('/assets/teams/team-placeholder.png');

      await addTeam({
        name: name.trim(),
        logo_url: finalLogoUrl,
        base_budget: baseBudgetNum,
      });

      onSave();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add team';
      console.error('[AddTeamModal] Error adding team:', err);
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">Add Team</h2>
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

          {/* Logo URL */}
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
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={getAssetPath('/assets/teams/team-logo.png')}
            />

            {/* Preview */}
            {logoUrl && (
              <div className="mt-3">
                <p className="text-xs text-neutral-500 mb-2">Preview:</p>
                <img
                  src={getAssetPath(logoUrl)}
                  alt="Preview"
                  className="w-24 h-24 object-contain rounded-lg border border-neutral-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAssetPath('/assets/team-placeholder.png');
                  }}
                />
              </div>
            )}
          </div>

          {/* Base Budget */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Base Budget *
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
            disabled={!name.trim() || isSaving}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Adding...' : 'Add Team'}
          </button>
        </div>
      </div>
    </div>
  );
}
