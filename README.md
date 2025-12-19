# BCL 2025 Bidding System

A professional cricket auction web application with dual-screen capability for managing player auctions and team budgets.

## Features

- **Admin Control Panel**: Manage live auctions, enter bids, assign players to teams
- **Display View**: Full-screen presentation for projector/TV with real-time updates
- **Post-Auction Management**: Edit transactions, modify team assignments, export data
- **Real-time Sync**: Supabase Realtime keeps admin panel and display view synchronized

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Icons**: Lucide React

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Create a new Supabase project
   - Run the migration from `supabase/migrations/001_initial_schema.sql`
   - Copy `.env.example` to `.env` and add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Copy player photos**:
   ```bash
   cp -r ../bcl/output/*.jpg public/assets/players/
   ```

4. **Seed the database**:
   ```bash
   npm run seed
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
bcl-2025-bidding/
├── src/
│   ├── routes/          # TanStack Router routes
│   ├── components/      # React components
│   ├── lib/            # Supabase client, types
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
├── public/
│   └── assets/         # Player photos, team logos, backgrounds
└── supabase/
    └── migrations/     # Database migrations
```

## Routes

- `/` - Landing page with navigation
- `/admin/auction` - Admin auction control panel
- `/admin/manage` - Post-auction management
- `/display` - Full-screen presentation view

## Auction Configuration

- **Teams**: 12 teams with ₹1,00,000 budget each
- **Base Price**: ₹2,000 for all players
- **Total Players**: 157 players

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

Private project for BCL 2025 auction.
