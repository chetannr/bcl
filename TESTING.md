# Testing Guide - BCL 2025 Auction Flow

This document outlines the complete testing procedure for the auction bidding system.

## Pre-Testing Setup

1. **Database Setup**:
   - Ensure teams are created in Supabase
   - Ensure players are imported with status 'unsold'
   - Verify auction_state table has initial row

2. **Environment**:
   - Start dev server: `npm run dev`
   - Open two browser windows:
     - Window 1: Admin panel (`http://localhost:5173/admin/auction`)
     - Window 2: Display view (`http://localhost:5173/display`)

## Test Scenarios

### 1. Player Selection Flow

**Steps**:
1. In admin panel, verify Player Queue shows unsold players
2. Click on a player from the queue
3. Verify player appears in center Player Card
4. Verify display view updates to show selected player

**Expected Results**:
- ✅ Player Queue highlights selected player
- ✅ Player Card displays player details (name, photo, category, base price)
- ✅ Display view shows player with "Ready to Bid" status
- ✅ Real-time update works (no page refresh needed)

### 2. Bidding Flow - Successful Sale

**Steps**:
1. Select a player from queue
2. Enter bid amount (must be >= base price)
3. Select a team with sufficient balance
4. Click "Mark as SOLD"
5. Click "Next Player"

**Expected Results**:
- ✅ Bid amount validation works (shows error if < base price)
- ✅ Team balance validation works (shows error if insufficient)
- ✅ After sale:
  - Player status changes to 'sold'
  - Team balance decreases by bid amount
  - Team player count increases
  - Auction result is created
  - Display view shows "SOLD" with team name and amount
- ✅ Next player is automatically selected
- ✅ Real-time updates work in both windows

### 3. Mark as Unsold Flow

**Steps**:
1. Select a player from queue
2. Click "Mark as UNSOLD"
3. Click "Next Player"

**Expected Results**:
- ✅ Player status remains 'unsold'
- ✅ No auction result created
- ✅ Team balances unchanged
- ✅ Next player is selected
- ✅ Display view updates

### 4. Team Budget Validation

**Steps**:
1. Select a player with base price ₹5,000
2. Select a team with balance ₹3,000
3. Enter bid amount ₹5,000
4. Try to mark as sold

**Expected Results**:
- ✅ Error message: "Team balance insufficient"
- ✅ Sale is prevented
- ✅ Team balance unchanged

### 5. Search and Filter

**Steps**:
1. In Player Queue, use search box
2. Search by player name
3. Search by phone number
4. Filter by category (Batsman, Bowler, All Rounder)

**Expected Results**:
- ✅ Search filters players in real-time
- ✅ Category filter works correctly
- ✅ Filtered count updates

### 6. Real-time Synchronization

**Steps**:
1. Open admin panel in Window 1
2. Open display view in Window 2
3. In Window 1, select a player
4. In Window 1, sell the player

**Expected Results**:
- ✅ Window 2 updates automatically (no refresh)
- ✅ Both windows show same current player
- ✅ Both windows show same auction state
- ✅ Team budgets update in real-time

### 7. End of Auction

**Steps**:
1. Sell or mark unsold all players
2. Click "Next Player" when no players remain

**Expected Results**:
- ✅ Player Card shows "No player selected"
- ✅ Display view shows "Waiting for Next Player"
- ✅ No errors in console

### 8. Performance Testing

**Check**:
- ✅ Page load time < 2 seconds
- ✅ Real-time updates < 500ms latency
- ✅ No console errors
- ✅ Smooth scrolling in Player Queue
- ✅ No memory leaks (check with DevTools)

### 9. Error Handling

**Test Cases**:
1. Network disconnection during sale
2. Invalid bid amount
3. Selecting team with insufficient balance
4. Rapid clicking on buttons

**Expected Results**:
- ✅ Error messages displayed clearly
- ✅ No duplicate transactions
- ✅ UI remains responsive
- ✅ State doesn't corrupt

## Performance Benchmarks

Target metrics:
- **Initial Load**: < 2s
- **Time to Interactive**: < 3s
- **Real-time Update Latency**: < 500ms
- **Bundle Size**: < 500KB (gzipped)

## Browser Compatibility

Test on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Automated Testing (Future)

Consider adding:
- Unit tests for validation functions
- Integration tests for auction flow
- E2E tests with Playwright/Cypress
- Performance tests with Lighthouse

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (if any)
5. Network tab screenshots (if relevant)
