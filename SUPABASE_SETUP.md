# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
- Login with chetan.nr@gmail.com(github.com account)
- Organization: Propage
- Project name: BCL Project
- Database password: JVlhrtyDPOTTVYIf
- Region: Asia-Pacific
- Project URL: https://rnroiebdxsrvpatrmhmw.supabase.co
- API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucm9pZWJkeHNydnBhdHJtaG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzQ5MDUsImV4cCI6MjA4MTY1MDkwNX0.ChvER2dzVOHi8E1zCbriNsN7osmsyu8LSaIuQSl1Ico

2. Create a new project
3. Note your project URL and anon key from Settings > API

## 2. Run Database Migration

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the migration

This will create:
- `teams` table (12 teams)
- `players` table (157 players)
- `auction_results` table
- `auction_state` table
- Triggers for automatic balance updates
- Row Level Security policies

## 3. Enable Realtime

1. Go to Database > Replication in Supabase dashboard
2. Enable replication for:
   - `teams` table
   - `players` table
   - `auction_results` table
   - `auction_state` table

## 4. Set Up Storage (Optional)

If you want to store player photos in Supabase Storage:

1. Go to Storage in Supabase dashboard
2. Create a bucket named `player-photos`
3. Set it to public
4. Upload player photos (named by phone number)

Alternatively, you can serve photos from the `public/assets/players/` folder.

## 5. Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 6. Seed Data

After running migrations, use the seed script to populate teams and players:

```bash
npm run seed
```

Or manually insert teams using the SQL in `scripts/seed-teams.sql`.
