import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { TransactionTable } from '../../components/admin/TransactionTable';
import { EditTransactionModal } from '../../components/admin/EditTransactionModal';
import { PlayerManagement } from '../../components/admin/PlayerManagement';
import { EditPlayerModal } from '../../components/admin/EditPlayerModal';
import { AddPlayerModal } from '../../components/admin/AddPlayerModal';
import { TeamManagement } from '../../components/admin/TeamManagement';
import { EditTeamModal } from '../../components/admin/EditTeamModal';
import { AddTeamModal } from '../../components/admin/AddTeamModal';
import { Home, Download } from 'lucide-react';
import type { AuctionResult, Player, Team } from '../../lib/types';

export const Route = createFileRoute('/admin/manage')({
  component: () => (
    <ProtectedRoute>
      <AdminManage />
    </ProtectedRoute>
  ),
});

function AdminManage() {
  console.log('[Route: /admin/manage] Admin manage component rendered');
  const navigate = useNavigate();
  const deleteAuctionResult = useMutation(api.mutations.deleteAuctionResult);
  const updateAuctionResult = useMutation(api.mutations.updateAuctionResult);
  const [editingTransaction, setEditingTransaction] = useState<AuctionResult | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [activeTab, setActiveTab] = useState<'transactions' | 'players' | 'teams'>('transactions');
  console.log('[Route: /admin/manage] Editing transaction:', editingTransaction);
  console.log('[Route: /admin/manage] Editing player:', editingPlayer);
  console.log('[Route: /admin/manage] Editing team:', editingTeam);

  const handleEdit = (transaction: AuctionResult) => {
    console.log('[Route: /admin/manage] handleEdit called for transaction:', transaction._id);
    setEditingTransaction(transaction);
  };

  const handleDelete = async (transaction: AuctionResult) => {
    console.log('[Route: /admin/manage] handleDelete called for transaction:', transaction._id);
    if (!confirm(`Are you sure you want to delete the transaction for ${transaction.player?.name}? This will refund the team and mark the player as unsold.`)) {
      console.log('[Route: /admin/manage] Delete cancelled by user');
      return;
    }

    try {
      console.log('[Route: /admin/manage] Deleting transaction from database:', transaction._id);
      await deleteAuctionResult({ resultId: transaction._id });
      console.log('[Route: /admin/manage] Delete successful');
    } catch (error) {
      console.error('[Route: /admin/manage] Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const handleSaveEdit = async (
    transactionId: string,
    teamId: string,
    amount: number
  ) => {
    console.log('[Route: /admin/manage] handleSaveEdit called:', { transactionId, teamId, amount });
    try {
      await updateAuctionResult({
        resultId: transactionId,
        newTeamId: teamId,
        newAmount: amount,
      });
      
      setEditingTransaction(null);
      console.log('[Route: /admin/manage] Update successful');
    } catch (error) {
      console.error('[Route: /admin/manage] Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };

  const auctionResults = useQuery(api.queries.getAuctionResults);

  const handleExportCSV = async () => {
    console.log('[Route: /admin/manage] handleExportCSV called');
    
    if (!auctionResults || auctionResults.length === 0) {
      console.log('[Route: /admin/manage] No results to export');
      return;
    }

    console.log('[Route: /admin/manage] Creating CSV with', auctionResults.length, 'rows');
    // Create CSV content
    const headers = ['Order', 'Player Name', 'Category', 'Team', 'Amount'];
    const rows = auctionResults.map((r) => [
      r.auction_order.toString(),
      r.player?.name || '',
      r.player?.category || '',
      r.team?.name || '',
      r.final_amount.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const filename = `bcl-2025-auction-results-${new Date().toISOString().split('T')[0]}.csv`;
    console.log('[Route: /admin/manage] Downloading CSV file:', filename);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    console.log('[Route: /admin/manage] CSV export completed');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">Post-Auction Management</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <button
              onClick={() => {
                console.log('[Route: /admin/manage] Navigating to /home');
                navigate({ to: '/home' });
              }}
              className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Tabs */}
        <div className="mb-4 border-b border-neutral-200">
          <div className="flex gap-4">
            <button
              onClick={() => {
                console.log('[Route: /admin/manage] Switching to transactions tab');
                setActiveTab('transactions');
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => {
                console.log('[Route: /admin/manage] Switching to players tab');
                setActiveTab('players');
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'players'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Player Management
            </button>
            <button
              onClick={() => {
                console.log('[Route: /admin/manage] Switching to teams tab');
                setActiveTab('teams');
              }}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'teams'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Team Management
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'transactions' ? (
          <TransactionTable onEdit={handleEdit} onDelete={handleDelete} />
        ) : activeTab === 'players' ? (
          <PlayerManagement
            onEditPlayer={(player) => {
              console.log('[Route: /admin/manage] Opening edit player modal for:', player._id);
              setEditingPlayer(player);
            }}
            onAddPlayer={() => {
              console.log('[Route: /admin/manage] Opening add player modal');
              setShowAddPlayer(true);
            }}
          />
        ) : (
          <TeamManagement
            onEditTeam={(team) => {
              console.log('[Route: /admin/manage] Opening edit team modal for:', team._id);
              setEditingTeam(team);
            }}
            onAddTeam={() => {
              console.log('[Route: /admin/manage] Opening add team modal');
              setShowAddTeam(true);
            }}
          />
        )}
      </div>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Edit Player Modal */}
      {editingPlayer && (
        <EditPlayerModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onSave={() => {
            console.log('[Route: /admin/manage] Player updated');
          }}
        />
      )}

      {/* Add Player Modal */}
      {showAddPlayer && (
        <AddPlayerModal
          onClose={() => setShowAddPlayer(false)}
          onSave={() => {
            console.log('[Route: /admin/manage] Player added');
          }}
        />
      )}

      {/* Edit Team Modal */}
      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
          onSave={() => {
            console.log('[Route: /admin/manage] Team updated');
          }}
        />
      )}

      {/* Add Team Modal */}
      {showAddTeam && (
        <AddTeamModal
          onClose={() => setShowAddTeam(false)}
          onSave={() => {
            console.log('[Route: /admin/manage] Team added');
          }}
        />
      )}
    </div>
  );
}
