import { useState, useMemo } from 'react';
import { useTeams } from '../../lib/queries';
import { getAssetPath } from '../../utils/assets';
import { Edit, Plus, Search } from 'lucide-react';
import type { Team } from '../../lib/types';
import { formatCurrency } from '../../utils/currency';

interface TeamManagementProps {
  onEditTeam: (team: Team) => void;
  onAddTeam: () => void;
}

export function TeamManagement({ onEditTeam, onAddTeam }: TeamManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allTeams, isLoading } = useTeams();

  const filteredTeams = useMemo(() => {
    if (!allTeams) return [];
    
    return allTeams.filter((team) => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [allTeams, searchQuery]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-neutral-500">
        Loading teams...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Team Management</h2>
        <button
          onClick={onAddTeam}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Team
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-neutral-200">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by team name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Team List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Logo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Team Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Base Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Current Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Players
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                  No teams found
                </td>
              </tr>
            ) : (
              filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={getAssetPath(team.logo_url)}
                      alt={team.name}
                      className="w-16 h-16 object-contain rounded-lg border border-neutral-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getAssetPath('/assets/team-placeholder.png');
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">{team.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{formatCurrency(team.base_budget)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">{formatCurrency(team.current_balance)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{team.players_count}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditTeam(team)}
                      className="text-primary-600 hover:text-primary-900 p-2 rounded hover:bg-primary-50"
                      title="Edit Team"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50">
        <div className="text-sm text-neutral-600">
          Showing <span className="font-semibold">{filteredTeams.length}</span> team{filteredTeams.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
