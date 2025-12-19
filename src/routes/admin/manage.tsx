import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
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
  component: AdminManage,
});

function AdminManage() {
  console.log('[Route: /admin/manage] Admin manage component rendered');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    console.log('[Route: /admin/manage] handleEdit called for transaction:', transaction.id);
    setEditingTransaction(transaction);
  };

  const handleDelete = async (transaction: AuctionResult) => {
    console.log('[Route: /admin/manage] handleDelete called for transaction:', transaction.id);
    if (!confirm(`Are you sure you want to delete the transaction for ${transaction.player?.name}? This will refund the team and mark the player as unsold.`)) {
      console.log('[Route: /admin/manage] Delete cancelled by user');
      return;
    }

    try {
      console.log('[Route: /admin/manage] Deleting transaction from database:', transaction.id);
      const { error } = await supabase
        .from('auction_results')
        .delete()
        .eq('id', transaction.id);

      if (error) throw error;

      console.log('[Route: /admin/manage] Transaction deleted, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['auction-results'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
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
      // Get current transaction
      console.log('[Route: /admin/manage] Fetching current transaction:', transactionId);
      const { data: currentTransaction, error: fetchError } = await supabase
        .from('auction_results')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (fetchError) throw fetchError;
      if (!currentTransaction) throw new Error('Transaction not found');
      console.log('[Route: /admin/manage] Current transaction fetched:', currentTransaction);

      const transactionData = currentTransaction as any;

      // Delete old transaction (triggers refund)
      console.log('[Route: /admin/manage] Deleting old transaction:', transactionId);
      const { error: deleteError } = await supabase
        .from('auction_results')
        .delete()
        .eq('id', transactionId);

      if (deleteError) throw deleteError;
      console.log('[Route: /admin/manage] Old transaction deleted');

      // Create new transaction with updated values
      const insertData: any = {
        player_id: transactionData.player_id,
        team_id: teamId,
        final_amount: amount,
        auction_order: transactionData.auction_order,
      };
      console.log('[Route: /admin/manage] Inserting new transaction:', insertData);
      const { error: insertError } = await supabase
        .from('auction_results')
        .insert(insertData);

      if (insertError) throw insertError;
      console.log('[Route: /admin/manage] New transaction inserted');

      console.log('[Route: /admin/manage] Invalidating queries after update');
      queryClient.invalidateQueries({ queryKey: ['auction-results'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      
      setEditingTransaction(null);
      console.log('[Route: /admin/manage] Update successful');
    } catch (error) {
      console.error('[Route: /admin/manage] Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };

  const handleExportCSV = async () => {
    console.log('[Route: /admin/manage] handleExportCSV called');
    const results = queryClient.ensureQueryData({
      queryKey: ['auction-results'],
      queryFn: async () => {
        console.log('[Route: /admin/manage] Fetching auction results for CSV export');
        const { data, error } = await supabase
          .from('auction_results')
          .select(`
            *,
            player:players(*),
            team:teams(*)
          `)
          .order('auction_order', { ascending: true });
        
        if (error) throw error;
        console.log('[Route: /admin/manage] Auction results fetched:', data?.length || 0, 'results');
        return data as AuctionResult[];
      },
    });

    const resultsArray = (results as unknown) as AuctionResult[];
    if (!resultsArray || resultsArray.length === 0) {
      console.log('[Route: /admin/manage] No results to export');
      return;
    }

    console.log('[Route: /admin/manage] Creating CSV with', resultsArray.length, 'rows');
    // Create CSV content
    const headers = ['Order', 'Player Name', 'Category', 'Team', 'Amount', 'Sold At'];
    const rows = resultsArray.map((r: AuctionResult) => [
      r.auction_order.toString(),
      r.player?.name || '',
      r.player?.category || '',
      r.team?.name || '',
      r.final_amount.toString(),
      new Date(r.sold_at).toLocaleString(),
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
                console.log('[Route: /admin/manage] Navigating to /');
                navigate({ to: '/' });
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
              console.log('[Route: /admin/manage] Opening edit player modal for:', player.id);
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
              console.log('[Route: /admin/manage] Opening edit team modal for:', team.id);
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
            console.log('[Route: /admin/manage] Player updated, invalidating queries');
            queryClient.invalidateQueries({ queryKey: ['players'] });
            queryClient.invalidateQueries({ queryKey: ['auction-results'] });
          }}
        />
      )}

      {/* Add Player Modal */}
      {showAddPlayer && (
        <AddPlayerModal
          onClose={() => setShowAddPlayer(false)}
          onSave={() => {
            console.log('[Route: /admin/manage] Player added, invalidating queries');
            queryClient.invalidateQueries({ queryKey: ['players'] });
          }}
        />
      )}

      {/* Edit Team Modal */}
      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
          onSave={() => {
            console.log('[Route: /admin/manage] Team updated, invalidating queries');
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            queryClient.invalidateQueries({ queryKey: ['auction-results'] });
          }}
        />
      )}

      {/* Add Team Modal */}
      {showAddTeam && (
        <AddTeamModal
          onClose={() => setShowAddTeam(false)}
          onSave={() => {
            console.log('[Route: /admin/manage] Team added, invalidating queries');
            queryClient.invalidateQueries({ queryKey: ['teams'] });
          }}
        />
      )}
    </div>
  );
}
