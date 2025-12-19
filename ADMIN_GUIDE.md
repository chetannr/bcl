# BCL 2025 Auction - Admin User Guide

Complete guide for administrators managing the cricket player auction system.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin Auction Control Panel](#admin-auction-control-panel)
3. [Running an Auction](#running-an-auction)
4. [Post-Auction Management](#post-auction-management)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Keyboard Shortcuts & Tips](#keyboard-shortcuts--tips)

---

## Getting Started

### Accessing the Admin Panel

1. **Open the application** in your web browser
   - Local development: `http://localhost:5174/`
   - Production: Your deployed URL

2. **Navigate to Admin Panel**
   - Click **"Admin Control Panel"** button on the home page
   - Or go directly to: `/admin/auction`

3. **Verify Setup**
   - You should see:
     - Team Budget Panel at the top (showing all 12 teams)
     - Player Queue on the left sidebar
     - Current Player Display in the center
     - Auction Controls on the right sidebar

---

## Admin Auction Control Panel

### Interface Overview

The admin panel is divided into **4 main sections**:

#### 1. **Team Budget Panel** (Top)
- Displays all 12 teams with:
  - Team logo and name
  - Current balance (remaining budget)
  - Number of players purchased
- Updates in real-time as players are sold

#### 2. **Player Queue** (Left Sidebar)
- Lists all unsold players
- Features:
  - **Search bar**: Search by player name or phone number
  - **Category filters**: Filter by Batsman, Bowler, All Rounder, or All
  - **Player count**: Shows number of unsold players
- Click any player to select them for auction

#### 3. **Current Player Display** (Center)
- Shows detailed information about the selected player:
  - Player photo
  - Name, age, category
  - Base price
  - Current status

#### 4. **Auction Controls** (Right Sidebar)
- Main control panel for auction actions:
  - Bid amount input
  - Team selector
  - Action buttons (Sell, Mark Unsold, Next Player)

---

## Running an Auction

### Step-by-Step Auction Process

#### Step 1: Select a Player

1. **From Player Queue**:
   - Browse the list of unsold players
   - Use search to find a specific player
   - Use category filters to narrow down options
   - **Click on a player** to select them

2. **Verify Selection**:
   - Player details appear in the center panel
   - Player is highlighted in the queue
   - Display view (if open) updates automatically

#### Step 2: Enter Bid Information

1. **Enter Bid Amount**:
   - Type the final bid amount in the "Bid Amount" field
   - Minimum: Player's base price (₹2,000)
   - Step: ₹100 increments
   - Formatted amount displays below the input

2. **Select Team**:
   - Choose the winning team from the dropdown
   - Only teams with sufficient balance are shown
   - Team balance info displays automatically

3. **Review Details**:
   - Check team's current balance
   - Verify remaining balance after purchase
   - Ensure bid amount is correct

#### Step 3: Complete the Sale

**Option A: Mark as SOLD**
1. Click **"Mark as SOLD"** button (green button)
2. System validates:
   - Bid amount ≥ base price
   - Team has sufficient balance
3. On success:
   - Player status changes to "sold"
   - Team balance decreases
   - Team player count increases
   - Transaction is recorded
   - Next player is automatically selected

**Option B: Mark as UNSOLD**
1. Click **"Mark as UNSOLD"** button (grey button)
2. Player remains unsold
3. No transaction is created
4. Next player is automatically selected

**Option C: Skip to Next Player**
1. Click **"Next Player"** button (blue button)
2. Moves to next unsold player without action
3. Current player remains unsold

### Validation Rules

The system automatically validates:

- ✅ **Bid Amount**: Must be at least the player's base price
- ✅ **Team Balance**: Team must have sufficient funds
- ✅ **Team Selection**: A team must be selected before selling
- ✅ **Player Status**: Only unsold players can be auctioned

**Error Messages**:
- "Bid must be at least ₹X,XXX" - Increase bid amount
- "Team balance insufficient" - Select different team or reduce bid
- "Please select a team" - Choose a team from dropdown

---

## Post-Auction Management

### Accessing Post-Auction Management

1. From home page: Click **"Post-Auction Management"**
2. Or navigate to: `/admin/manage`

### Features

#### 1. **View All Transactions**
- Complete list of all sold players
- Shows:
  - Auction order number
  - Player name and category
  - Team name with logo
  - Final bid amount
  - Date and time of sale

#### 2. **Search Transactions**
- Search bar at the top
- Search by:
  - Player name
  - Team name
  - Bid amount

#### 3. **Edit Transactions**

**To Edit a Transaction**:
1. Click the **Edit icon** (pencil) next to the transaction
2. Edit Transaction modal opens
3. Modify:
   - **Bid Amount**: Change the final sale price
   - **Team**: Transfer player to different team
4. Review balance calculations:
   - Old team gets refunded automatically
   - New team balance is checked
5. Click **"Save Changes"**

**Important Notes**:
- Editing automatically refunds the old team
- New team balance must be sufficient
- Auction order number remains the same
- All changes are logged with timestamps

#### 4. **Delete Transactions**

**To Delete a Transaction**:
1. Click the **Delete icon** (trash) next to the transaction
2. Confirm the deletion
3. System automatically:
   - Refunds the team's balance
   - Marks player as "unsold"
   - Removes the transaction record

**Use Cases**:
- Correcting mistakes
- Re-auctioning a player
- Removing test transactions

#### 5. **Export to CSV**

**To Export Auction Results**:
1. Click **"Export CSV"** button in the header
2. CSV file downloads automatically
3. File name: `bcl-2025-auction-results-YYYY-MM-DD.csv`
4. Contains:
   - Order number
   - Player name
   - Category
   - Team name
   - Amount
   - Sold date/time

**Use Cases**:
- Creating reports
- Sharing results with teams
- Archiving auction data
- Financial reconciliation

---

## Best Practices

### Before Starting the Auction

1. **Verify Setup**:
   - ✅ All 12 teams are loaded
   - ✅ All players are in the database
   - ✅ Team budgets are correct (₹1,00,000 each)
   - ✅ Display view is open and working

2. **Test Connection**:
   - Open admin panel and display view in separate windows
   - Select a test player
   - Verify real-time updates work

3. **Prepare Environment**:
   - Use a reliable internet connection
   - Have a backup device ready
   - Keep Supabase dashboard open for monitoring

### During the Auction

1. **Workflow Tips**:
   - Select player → Enter bid → Select team → Review → Sell
   - Double-check bid amounts before confirming
   - Verify team selection (especially similar team names)
   - Use search to quickly find players

2. **Error Prevention**:
   - Always verify team balance before selling
   - Check bid amount matches the final call
   - Confirm player details match the auction call

3. **Efficiency**:
   - Use category filters to navigate faster
   - Search by phone number for quick lookup
   - Use "Next Player" to skip players quickly

### After the Auction

1. **Review Transactions**:
   - Check all transactions in Post-Auction Management
   - Verify team balances are correct
   - Look for any discrepancies

2. **Export Data**:
   - Export CSV for records
   - Save backup copy
   - Share with relevant parties

3. **Clean Up**:
   - Review and correct any errors
   - Mark any remaining players as unsold if needed
   - Finalize all transactions

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Missing Supabase environment variables"
**Solution**:
- Check that `.env` file exists in project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart the dev server after adding environment variables

#### Issue: Real-time updates not working
**Solution**:
- Check Supabase Realtime is enabled for all 4 tables
- Verify internet connection
- Refresh the browser
- Check browser console for WebSocket errors

#### Issue: Team balance not updating
**Solution**:
- Refresh the page
- Check database triggers are installed (run migration)
- Verify transaction was created successfully
- Check Supabase dashboard for errors

#### Issue: Player not appearing in queue
**Solution**:
- Check player status is "unsold"
- Clear search/filter to see all players
- Refresh the page
- Verify player exists in database

#### Issue: "Team balance insufficient" error
**Solution**:
- Check team's current balance in Team Budget Panel
- Reduce bid amount
- Select a different team
- Verify team hasn't exceeded budget

#### Issue: Can't select a player
**Solution**:
- Ensure player status is "unsold"
- Check if player is already sold
- Refresh the page
- Try selecting from different position in queue

#### Issue: Display view not updating
**Solution**:
- Check both windows are on same network
- Verify Supabase Realtime is enabled
- Refresh display view window
- Check browser console for errors

### Getting Help

If issues persist:
1. Check browser console for error messages
2. Verify Supabase dashboard shows no errors
3. Check network connectivity
4. Review database logs in Supabase
5. Restart the application

---

## Keyboard Shortcuts & Tips

### Navigation Tips

- **Quick Search**: Click search bar and type player name or phone
- **Category Filter**: Click category buttons to filter quickly
- **Next Player**: Use "Next Player" button to skip without action
- **Home Button**: Click Home icon to return to main menu

### Efficiency Tips

1. **Use Search Frequently**:
   - Players are often called by name
   - Phone numbers are unique identifiers
   - Faster than scrolling through list

2. **Category Filters**:
   - Filter by Batsman/Bowler/All Rounder
   - Reduces list size for faster navigation

3. **Team Budget Monitoring**:
   - Keep an eye on team balances
   - Helps prevent insufficient balance errors
   - Shows which teams are active

4. **Real-time Sync**:
   - Display view updates automatically
   - No need to refresh manually
   - Changes appear instantly

### Workflow Optimization

**Recommended Workflow**:
1. Select player from queue
2. Verify player details in center panel
3. Enter bid amount
4. Select team (check balance)
5. Review all details
6. Click "Mark as SOLD"
7. System auto-advances to next player

**For Fast Auctions**:
- Pre-select next player while current one is being processed
- Use search to jump to specific players
- Keep team budget panel visible for quick reference

---

## Important Notes

### Data Integrity

- ✅ All transactions are automatically validated
- ✅ Team balances update automatically via database triggers
- ✅ Player status changes are tracked
- ✅ Auction order is maintained automatically

### Real-time Features

- ✅ Changes appear instantly on all connected devices
- ✅ Display view updates automatically
- ✅ Team budgets sync in real-time
- ✅ No manual refresh needed

### Safety Features

- ✅ Validation prevents invalid transactions
- ✅ Balance checks prevent overspending
- ✅ Confirmation dialogs for deletions
- ✅ Error messages guide corrections

---

## Quick Reference

### Admin Panel URLs

- **Home**: `/`
- **Auction Control**: `/admin/auction`
- **Post-Auction Management**: `/admin/manage`
- **Display View**: `/display`

### Key Actions

| Action | Button | Location |
|--------|--------|----------|
| Sell Player | "Mark as SOLD" (Green) | Auction Controls |
| Mark Unsold | "Mark as UNSOLD" (Grey) | Auction Controls |
| Next Player | "Next Player" (Blue) | Auction Controls |
| Edit Transaction | Edit Icon | Post-Auction Management |
| Delete Transaction | Delete Icon | Post-Auction Management |
| Export CSV | "Export CSV" | Post-Auction Management |

### Validation Rules

- Minimum bid: Player's base price (₹2,000)
- Bid increments: ₹100
- Team balance: Must be sufficient for bid amount
- Player status: Must be "unsold" to auction

---

## Support

For technical issues or questions:
1. Check this guide first
2. Review error messages in browser console
3. Check Supabase dashboard for database errors
4. Verify all setup steps are completed

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Application**: BCL 2025 Bidding System
