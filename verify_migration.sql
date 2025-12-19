-- Verification Query: Check if new columns exist in players table
-- Run this in Supabase SQL Editor to verify the migration was successful

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'players'
  AND column_name IN (
    'auction_serial_number',
    'is_valid_player',
    'jersey_number',
    'jersey_name'
  )
ORDER BY column_name;
