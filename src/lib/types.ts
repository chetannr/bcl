export interface Team {
  id: string;
  name: string;
  logo_url: string;
  base_budget: number;
  current_balance: number;
  players_count: number;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  age: string;
  category: string;
  phone: string;
  photo_url: string;
  player_type: string;
  base_price: number;
  status: 'unsold' | 'sold' | 'bidding';
  auction_order: number | null;
  auction_serial_number: number | null;
  is_valid_player: string;
  jersey_number: number | null;
  jersey_name: string;
  created_at: string;
}

export interface AuctionResult {
  id: string;
  player_id: string;
  team_id: string;
  final_amount: number;
  auction_order: number;
  sold_at: string;
  player?: Player;
  team?: Team;
}

export interface AuctionState {
  id: string;
  current_player_id: string | null;
  is_auction_active: boolean;
  is_bidding_open: boolean;
  last_updated: string;
}

export interface PlayerWithResult extends Player {
  auction_result?: AuctionResult;
}
