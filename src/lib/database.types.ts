// This will be generated from Supabase, but for now we'll define basic types
export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          base_budget: number;
          current_balance: number;
          players_count: number;
          created_at: string;
        };
        Insert: {
          name: string;
          logo_url: string;
          base_budget?: number;
          current_balance?: number;
          players_count?: number;
        };
        Update: Partial<Database['public']['Tables']['teams']['Insert']>;
      };
      players: {
        Row: {
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
        };
        Insert: {
          name: string;
          age?: string;
          category: string;
          phone: string;
          photo_url: string;
          player_type?: string;
          base_price?: number;
          status?: 'unsold' | 'sold' | 'bidding';
          auction_order?: number | null;
          auction_serial_number?: number | null;
          is_valid_player?: string;
          jersey_number?: number | null;
          jersey_name?: string;
        };
        Update: Partial<Database['public']['Tables']['players']['Insert']>;
      };
      auction_results: {
        Row: {
          id: string;
          player_id: string;
          team_id: string;
          final_amount: number;
          auction_order: number;
          sold_at: string;
        };
        Insert: {
          player_id: string;
          team_id: string;
          final_amount: number;
          auction_order: number;
        };
        Update: Partial<Database['public']['Tables']['auction_results']['Insert']>;
      };
      auction_state: {
        Row: {
          id: string;
          current_player_id: string | null;
          is_auction_active: boolean;
          is_bidding_open: boolean;
          last_updated: string;
        };
        Insert: {
          current_player_id?: string | null;
          is_auction_active?: boolean;
          is_bidding_open?: boolean;
        };
        Update: Partial<Database['public']['Tables']['auction_state']['Insert']>;
      };
    };
  };
}
