-- Migration: Add new fields to players table
-- Adds: auction_serial_number, is_valid_player, jersey_number, jersey_name

-- Add auction_serial_number column (nullable INTEGER)
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS auction_serial_number INTEGER;

-- Add is_valid_player column (TEXT with default 'Y', can be 'Y' or 'N')
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS is_valid_player TEXT DEFAULT 'Y';

-- Add constraint to ensure is_valid_player is either 'Y' or 'N'
ALTER TABLE players 
DROP CONSTRAINT IF EXISTS players_is_valid_player_check;

ALTER TABLE players 
ADD CONSTRAINT players_is_valid_player_check 
CHECK (is_valid_player IN ('Y', 'N'));

-- Set default value for existing rows to 'Y' if not already set
UPDATE players 
SET is_valid_player = 'Y' 
WHERE is_valid_player IS NULL;

-- Make is_valid_player NOT NULL after setting defaults
ALTER TABLE players 
ALTER COLUMN is_valid_player SET NOT NULL;

-- Add jersey_number column (nullable INTEGER)
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS jersey_number INTEGER;

-- Add jersey_name column (nullable TEXT)
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS jersey_name TEXT;
