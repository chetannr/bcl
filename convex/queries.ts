import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all teams ordered by name
export const getTeams = query({
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    return teams.sort((a, b) => a.name.localeCompare(b.name));
  },
});

// Get players filtered by status
export const getPlayers = query({
  args: {
    status: v.optional(
      v.union(v.literal("unsold"), v.literal("sold"), v.literal("bidding"))
    ),
  },
  handler: async (ctx, args) => {
    let players;
    
    if (args.status) {
      players = await ctx.db
        .query("players")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      players = await ctx.db.query("players").collect();
    }
    
    return players.sort((a, b) => a.name.localeCompare(b.name));
  },
});

// Get single player by ID
export const getPlayer = query({
  args: {
    playerId: v.union(v.id("players"), v.null()),
  },
  handler: async (ctx, args) => {
    if (!args.playerId) {
      return null;
    }
    return await ctx.db.get(args.playerId);
  },
});

// Get current auction state
export const getAuctionState = query({
  handler: async (ctx) => {
    const states = await ctx.db.query("auction_state").collect();
    return states[0] || null;
  },
});

// Get current player (combines auction state + player lookup)
export const getCurrentPlayer = query({
  handler: async (ctx) => {
    const states = await ctx.db.query("auction_state").collect();
    const state = states[0];
    
    if (!state || !state.current_player_id) {
      return null;
    }
    
    return await ctx.db.get(state.current_player_id);
  },
});

// Get all auction results with player and team data
export const getAuctionResults = query({
  handler: async (ctx) => {
    const results = await ctx.db
      .query("auction_results")
      .withIndex("by_auction_order")
      .collect();
    
    // Fetch related player and team data
    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        const player = await ctx.db.get(result.player_id);
        const team = await ctx.db.get(result.team_id);
        return {
          ...result,
          player,
          team,
        };
      })
    );
    
    return enrichedResults;
  },
});

// Get auction results for a specific team
export const getTeamAuctionResults = query({
  args: {
    teamId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("auction_results")
      .collect();
    
    const teamResults = results.filter(r => r.team_id === args.teamId);
    
    // Fetch player data
    const enrichedResults = await Promise.all(
      teamResults.map(async (result) => {
        const player = await ctx.db.get(result.player_id);
        return {
          ...result,
          player,
        };
      })
    );
    
    return enrichedResults.sort((a, b) => a.auction_order - b.auction_order);
  },
});

// Get team with calculated current balance
export const getTeam = query({
  args: {
    teamId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.teamId);
  },
});
