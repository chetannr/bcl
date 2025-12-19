import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useRealtimeAuction() {
  console.log('[Hook: useRealtimeAuction] Hook initialized');
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('[Hook: useRealtimeAuction] Setting up real-time subscriptions...');
    // Use a single channel for better performance
    const channel = supabase
      .channel('auction-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
        },
        () => {
          console.log('[Hook: useRealtimeAuction] Teams table changed, invalidating queries');
          queryClient.invalidateQueries({ queryKey: ['teams'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
        },
        () => {
          console.log('[Hook: useRealtimeAuction] Players table changed, invalidating queries');
          queryClient.invalidateQueries({ queryKey: ['players'] });
          queryClient.invalidateQueries({ queryKey: ['player'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auction_results',
        },
        () => {
          console.log('[Hook: useRealtimeAuction] Auction results table changed, invalidating queries');
          queryClient.invalidateQueries({ queryKey: ['auction-results'] });
          queryClient.invalidateQueries({ queryKey: ['teams'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auction_state',
        },
        (payload) => {
          console.log('[Hook: useRealtimeAuction] Auction state changed, payload:', payload);
          // Invalidate auction state to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['auction-state'] });
          // Invalidate and refetch all player queries to ensure current player updates
          queryClient.invalidateQueries({ queryKey: ['player'] });
          // Force refetch of active player queries
          queryClient.refetchQueries({ queryKey: ['player'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Hook: useRealtimeAuction] Real-time subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[Hook: useRealtimeAuction] Real-time subscription error');
        } else {
          console.log('[Hook: useRealtimeAuction] Subscription status:', status);
        }
      });

    return () => {
      console.log('[Hook: useRealtimeAuction] Cleaning up real-time subscriptions');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
