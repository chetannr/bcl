import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import type { Team, Player, AuctionResult, AuctionState } from './types';
import type { Database } from './database.types';

// Teams queries
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Team[];
    },
    staleTime: 1000 * 10, // 10 seconds - teams update frequently during auction
  });
}

// Players queries
export function usePlayers(status?: 'unsold' | 'sold' | 'bidding') {
  return useQuery({
    queryKey: ['players', status],
    queryFn: async () => {
      let query = supabase.from('players').select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as Player[];
    },
  });
}

export function usePlayer(playerId: string | null) {
  return useQuery({
    queryKey: ['player', playerId],
    queryFn: async () => {
      if (!playerId) return null;
      
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (error) throw error;
      return data as Player;
    },
    enabled: !!playerId,
    staleTime: 0, // Always fresh - current player changes frequently
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus (we use real-time)
  });
}

// Auction state queries
export function useAuctionState() {
  return useQuery({
    queryKey: ['auction-state'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auction_state')
        .select('*')
        .single();
      
      if (error) throw error;
      return data as AuctionState;
    },
    staleTime: 0, // Always fresh - critical for auction state
    refetchInterval: 2000, // Poll every 2 seconds as backup to real-time
  });
}

// Auction results queries
export function useAuctionResults() {
  return useQuery({
    queryKey: ['auction-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auction_results')
        .select(`
          *,
          player:players(*),
          team:teams(*)
        `)
        .order('auction_order', { ascending: true });
      
      if (error) throw error;
      return data as AuctionResult[];
    },
  });
}

// Mutations
export function useSellPlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      playerId,
      teamId,
      amount,
      auctionOrder,
    }: {
      playerId: string;
      teamId: string;
      amount: number;
      auctionOrder: number;
    }) => {
      const { data, error } = await supabase
        .from('auction_results')
        .insert({
          player_id: playerId,
          team_id: teamId,
          final_amount: amount,
          auction_order: auctionOrder,
        } as Database['public']['Tables']['auction_results']['Insert'] as never)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['auction-results'] });
      queryClient.invalidateQueries({ queryKey: ['auction-state'] });
    },
  });
}

export function useUpdateAuctionState() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<AuctionState>) => {
      console.log('[Mutation: useUpdateAuctionState] Starting mutation with updates:', updates);
      
      // First, get the current auction state to get the id
      const { data: currentState, error: fetchError } = await supabase
        .from('auction_state')
        .select('id')
        .single<{ id: string }>();
      
      if (fetchError) {
        console.error('[Mutation: useUpdateAuctionState] Error fetching auction state:', fetchError);
        throw fetchError;
      }
      
      if (!currentState?.id) {
        console.error('[Mutation: useUpdateAuctionState] No auction state found');
        throw new Error('Auction state not found');
      }
      
      console.log('[Mutation: useUpdateAuctionState] Updating auction state with id:', currentState.id);
      const updateData = {
        ...updates,
        last_updated: new Date().toISOString(),
      } as Database['public']['Tables']['auction_state']['Update'] & { last_updated?: string };
      console.log('[Mutation: useUpdateAuctionState] Update data:', updateData);
      
      const { data, error } = await supabase
        .from('auction_state')
        .update(updateData as never)
        .eq('id', currentState.id)
        .select()
        .single();
      
      if (error) {
        console.error('[Mutation: useUpdateAuctionState] Error updating auction state:', error);
        console.error('[Mutation: useUpdateAuctionState] Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('[Mutation: useUpdateAuctionState] Successfully updated auction state:', data);
      return data;
    },
    onSuccess: () => {
      console.log('[Mutation: useUpdateAuctionState] Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['auction-state'] });
    },
    onError: (error) => {
      console.error('[Mutation: useUpdateAuctionState] Mutation error:', error);
    },
  });
}

export function useSetNextPlayer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (playerId: string | null) => {
      console.log('[Mutation: useSetNextPlayer] Starting mutation with playerId:', playerId);
      
      // First, get the current auction state to get the id
      const { data: currentState, error: fetchError } = await supabase
        .from('auction_state')
        .select('id')
        .single<{ id: string }>();
      
      if (fetchError) {
        console.error('[Mutation: useSetNextPlayer] Error fetching auction state:', fetchError);
        throw fetchError;
      }
      
      if (!currentState?.id) {
        console.error('[Mutation: useSetNextPlayer] No auction state found');
        throw new Error('Auction state not found');
      }
      
      console.log('[Mutation: useSetNextPlayer] Updating auction state with id:', currentState.id);
      const updateData = {
        current_player_id: playerId,
        is_bidding_open: playerId ? true : false,
        last_updated: new Date().toISOString(),
      } as Database['public']['Tables']['auction_state']['Update'] & { last_updated?: string };
      console.log('[Mutation: useSetNextPlayer] Update data:', updateData);
      
      const { data, error } = await supabase
        .from('auction_state')
        .update(updateData as never)
        .eq('id', currentState.id)
        .select()
        .single();
      
      if (error) {
        console.error('[Mutation: useSetNextPlayer] Error updating auction state:', error);
        console.error('[Mutation: useSetNextPlayer] Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('[Mutation: useSetNextPlayer] Successfully updated auction state:', data);
      return data;
    },
    onSuccess: () => {
      console.log('[Mutation: useSetNextPlayer] Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['auction-state'] });
      queryClient.invalidateQueries({ queryKey: ['player'] });
    },
    onError: (error) => {
      console.error('[Mutation: useSetNextPlayer] Mutation error:', error);
    },
  });
}

export function useMarkPlayerUnsold() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (playerId: string) => {
      const updateData = { 
        status: 'unsold' as const, 
        auction_order: null 
      } as Database['public']['Tables']['players']['Update'];
      const { data, error } = await supabase
        .from('players')
        .update(updateData as never)
        .eq('id', playerId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
