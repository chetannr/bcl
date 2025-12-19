-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT NOT NULL,
  base_budget NUMERIC(10, 2) NOT NULL DEFAULT 100000,
  current_balance NUMERIC(10, 2) NOT NULL DEFAULT 100000,
  players_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age TEXT,
  category TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  photo_url TEXT NOT NULL,
  player_type TEXT,
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 2000,
  status TEXT NOT NULL DEFAULT 'unsold' CHECK (status IN ('unsold', 'sold', 'bidding')),
  auction_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auction results table
CREATE TABLE auction_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  final_amount NUMERIC(10, 2) NOT NULL,
  auction_order INTEGER NOT NULL,
  sold_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id)
);

-- Auction state table (single row)
CREATE TABLE auction_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  current_player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  is_auction_active BOOLEAN NOT NULL DEFAULT false,
  is_bidding_open BOOLEAN NOT NULL DEFAULT false,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial auction state
INSERT INTO auction_state (id) VALUES (uuid_generate_v4()) ON CONFLICT DO NOTHING;

-- Function to update team balance when player is sold
CREATE OR REPLACE FUNCTION update_team_balance_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease team balance
  UPDATE teams
  SET current_balance = current_balance - NEW.final_amount,
      players_count = players_count + 1
  WHERE id = NEW.team_id;
  
  -- Update player status
  UPDATE players
  SET status = 'sold',
      auction_order = NEW.auction_order
  WHERE id = NEW.player_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update team balance
CREATE TRIGGER trigger_update_team_balance
AFTER INSERT ON auction_results
FOR EACH ROW
EXECUTE FUNCTION update_team_balance_on_sale();

-- Function to refund team when auction result is deleted
CREATE OR REPLACE FUNCTION refund_team_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Increase team balance
  UPDATE teams
  SET current_balance = current_balance + OLD.final_amount,
      players_count = players_count - 1
  WHERE id = OLD.team_id;
  
  -- Update player status
  UPDATE players
  SET status = 'unsold',
      auction_order = NULL
  WHERE id = OLD.player_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refund team
CREATE TRIGGER trigger_refund_team
AFTER DELETE ON auction_results
FOR EACH ROW
EXECUTE FUNCTION refund_team_on_delete();

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_state ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all on teams" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all on auction_results" ON auction_results FOR ALL USING (true);
CREATE POLICY "Allow all on auction_state" ON auction_state FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_players_status ON players(status);
CREATE INDEX idx_players_auction_order ON players(auction_order);
CREATE INDEX idx_auction_results_team_id ON auction_results(team_id);
CREATE INDEX idx_auction_results_auction_order ON auction_results(auction_order);
