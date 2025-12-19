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
3. Set it to **public**
4. **CRITICAL: Set up RLS Policies** - This is required even for public buckets!

### Option A: Using SQL Editor (Recommended)

Go to **SQL Editor** in Supabase dashboard and run this SQL:

```sql
-- Allow public (anonymous) users to read/view player photos
CREATE POLICY "Public can view player photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'player-photos');

-- Allow public (anonymous) users to upload player photos
-- This allows uploads using the anon key (no authentication required)
CREATE POLICY "Public can upload player photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'player-photos');

-- Allow public (anonymous) users to update/upsert player photos
CREATE POLICY "Public can update player photos"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'player-photos')
WITH CHECK (bucket_id = 'player-photos');

-- Allow public (anonymous) users to delete player photos (optional)
CREATE POLICY "Public can delete player photos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'player-photos');
```

**Note:** If you get an error saying the policy already exists, you can drop and recreate it:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view player photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload player photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can update player photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete player photos" ON storage.objects;

-- Then create the policies as shown above
```

### Option B: Using Storage Policies UI

1. Go to **Storage** → **Policies** in Supabase dashboard
2. Select the `player-photos` bucket
3. Click **New Policy**
4. Create policies for:
   - **SELECT** (Read) - Target: `public`
   - **INSERT** (Upload) - Target: `public`
   - **UPDATE** (Update) - Target: `public`
   - **DELETE** (Delete) - Target: `public` (optional)

For each policy, use this definition:
```sql
bucket_id = 'player-photos'
```

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
