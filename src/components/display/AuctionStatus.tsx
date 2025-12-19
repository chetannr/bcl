import { useAuctionState } from '../../lib/queries';

export function AuctionStatus() {
  const { data: auctionState } = useAuctionState();

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${auctionState?.is_auction_active ? 'bg-success-500 animate-pulse' : 'bg-neutral-400'}`} />
        <span className="text-white text-lg font-semibold">
          {auctionState?.is_auction_active ? 'LIVE' : 'Auction Closed'}
        </span>
      </div>
      <div className="text-white/90 text-sm">
        BCL 2025 Auction
      </div>
    </div>
  );
}
