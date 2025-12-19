# Supabase Migration Instructions: Add Player Fields

## Overview
This migration adds 4 new fields to the `players` table:
- `auction_serial_number` (INTEGER, nullable)
- `is_valid_player` (TEXT, default 'Y', must be 'Y' or 'N')
- `jersey_number` (INTEGER, nullable)
- `jersey_name` (TEXT, nullable)

## Steps to Apply in Supabase Dashboard

1. **Navigate to SQL Editor**
   - Go to: https://supabase.com/dashboard/project/rnroiebdxsrvpatrmhmw/sql/new
   - Or: Dashboard → SQL Editor → New Query

2. **Copy and paste the following SQL:**

```sql
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
```

3. **Run the Migration**
   - Click the "Run" button (or press Ctrl+Enter / Cmd+Enter)
   - Wait for confirmation that the migration completed successfully

4. **Verify the Changes**
   - Go to: https://supabase.com/dashboard/project/rnroiebdxsrvpatrmhmw/database/tables
   - Click on the `players` table
   - Verify that the following columns are present:
     - `auction_serial_number` (integer, nullable)
     - `is_valid_player` (text, not null, default 'Y')
     - `jersey_number` (integer, nullable)
     - `jersey_name` (text, nullable)

## Notes

- The `is_valid_player` field will default to 'Y' for all existing rows
- All other new fields are nullable and will be NULL for existing rows
- The migration uses `IF NOT EXISTS` to make it safe to run multiple times
- After running this migration, the frontend application will be able to use these new fields

## Alternative: Using Supabase CLI

If you prefer using the Supabase CLI:

```bash
# Apply the migration
supabase db push

# Or apply the specific migration file
supabase migration up 002_add_player_fields
```
