import { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { X } from 'lucide-react';
import { getAssetPath } from '../../utils/assets';

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
  const [isSaving, setIsSaving] = useState(false);
  const addPlayer = useMutation(api.mutations.addPlayer);

  const handleSave = async () => {
    setError('');

    if (!name.trim()) {
      setError('Player name is required');
      return;
    }

    if (!age.trim()) {
      setError('Age is required');
      return;
    }

    const basePriceNum = parseFloat(basePrice);
    if (isNaN(basePriceNum) || basePriceNum < 0) {
      setError('Base price must be a valid number');
      return;
    }

    try {
      setIsSaving(true);
      const finalPhotoUrl = photoUrl.trim() || getAssetPath('/assets/player-template.png');
      const serialNum = auctionSerialNumber.trim() ? parseInt(auctionSerialNumber) : null;
      const jersey = jerseyNumber.trim() ? parseInt(jerseyNumber) : null;

      await addPlayer({
        name: name.trim(),
        age: age.trim(),
        category,
        phone: phone.trim(),
        photo_url: finalPhotoUrl,
        player_type: playerType,
        base_price: basePriceNum,
        auction_serial_number: serialNum,
        is_valid_player: isValidPlayer,
        jersey_number: jersey,
        jersey_name: jerseyName.trim(),
      });

      onSave();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add player';
      console.error('[AddPlayerModal] Error adding player:', err);
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">Add Player</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Age *</label>
              <input
                type="text"
                value={age}
                onChange={(e) => { setAge(e.target.value); setError(''); }}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All Rounder">All Rounder</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Photo URL</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={getAssetPath('/assets/players/player-photo.jpg')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Player Type</label>
              <select
                value={playerType}
                onChange={(e) => setPlayerType(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Regular">Regular</option>
                <option value="ICON">ICON</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Base Price *</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => { setBasePrice(e.target.value); setError(''); }}
                min="0"
                step="100"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Serial Number</label>
              <input
                type="number"
                value={auctionSerialNumber}
                onChange={(e) => setAuctionSerialNumber(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Jersey Number</label>
              <input
                type="number"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Jersey Name</label>
              <input
                type="text"
                value={jerseyName}
                onChange={(e) => setJerseyName(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-danger-700 text-sm">
              {error}
            </div>
          )}
        </div>

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
            {isSaving ? 'Adding...' : 'Add Player'}
          </button>
        </div>
      </div>
    </div>
  );
}
