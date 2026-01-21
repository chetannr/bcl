import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Update auction state
export const updateAuctionState = mutation({
  args: {
    current_player_id: v.optional(v.union(v.id("players"), v.null())),
    is_auction_active: v.optional(v.boolean()),
    is_bidding_open: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Get the first (and should be only) auction state
    const states = await ctx.db.query("auction_state").collect();
    
    if (states.length === 0) {
      // Create if doesn't exist
      return await ctx.db.insert("auction_state", {
        current_player_id: args.current_player_id ?? null,
        is_auction_active: args.is_auction_active ?? false,
        is_bidding_open: args.is_bidding_open ?? false,
      });
    }
    
    // Update existing state
    const state = states[0];
    await ctx.db.patch(state._id, {
      ...(args.current_player_id !== undefined && { current_player_id: args.current_player_id }),
      ...(args.is_auction_active !== undefined && { is_auction_active: args.is_auction_active }),
      ...(args.is_bidding_open !== undefined && { is_bidding_open: args.is_bidding_open }),
    });
    
    return state._id;
  },
});

// Set next player and open bidding
export const setNextPlayer = mutation({
  args: {
    playerId: v.union(v.id("players"), v.null()),
  },
  handler: async (ctx, args) => {
    const states = await ctx.db.query("auction_state").collect();
    
    if (states.length === 0) {
      return await ctx.db.insert("auction_state", {
        current_player_id: args.playerId,
        is_auction_active: true,
        is_bidding_open: args.playerId ? true : false,
      });
    }
    
    const state = states[0];
    await ctx.db.patch(state._id, {
      current_player_id: args.playerId,
      is_bidding_open: args.playerId ? true : false,
    });
    
    return state._id;
  },
});

// Sell player to team
export const sellPlayer = mutation({
  args: {
    playerId: v.id("players"),
    teamId: v.id("teams"),
    amount: v.number(),
    auctionOrder: v.number(),
  },
  handler: async (ctx, args) => {
    // Create auction result
    const resultId = await ctx.db.insert("auction_results", {
      player_id: args.playerId,
      team_id: args.teamId,
      final_amount: args.amount,
      auction_order: args.auctionOrder,
    });
    
    // Update player status
    await ctx.db.patch(args.playerId, {
      status: "sold",
      auction_order: args.auctionOrder,
    });
    
    // Update team budget and player count
    const team = await ctx.db.get(args.teamId);
    if (team) {
      await ctx.db.patch(args.teamId, {
        current_balance: team.current_balance - args.amount,
        players_count: team.players_count + 1,
      });
    }
    
    return resultId;
  },
});

// Mark player as unsold
export const markPlayerUnsold = mutation({
  args: {
    playerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      status: "unsold",
      auction_order: null,
    });
    
    return args.playerId;
  },
});

// Add new player
export const addPlayer = mutation({
  args: {
    name: v.string(),
    age: v.string(),
    category: v.string(),
    phone: v.string(),
    photo_url: v.string(),
    player_type: v.string(),
    base_price: v.number(),
    auction_serial_number: v.union(v.number(), v.null()),
    is_valid_player: v.string(),
    jersey_number: v.union(v.number(), v.null()),
    jersey_name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("players", {
      name: args.name,
      age: args.age,
      category: args.category,
      phone: args.phone,
      photo_url: args.photo_url,
      player_type: args.player_type,
      base_price: args.base_price,
      status: "unsold",
      auction_order: null,
      auction_serial_number: args.auction_serial_number,
      is_valid_player: args.is_valid_player,
      jersey_number: args.jersey_number,
      jersey_name: args.jersey_name,
    });
  },
});

// Update existing player
export const updatePlayer = mutation({
  args: {
    playerId: v.id("players"),
    name: v.optional(v.string()),
    age: v.optional(v.string()),
    category: v.optional(v.string()),
    phone: v.optional(v.string()),
    photo_url: v.optional(v.string()),
    player_type: v.optional(v.string()),
    base_price: v.optional(v.number()),
    auction_serial_number: v.optional(v.union(v.number(), v.null())),
    is_valid_player: v.optional(v.string()),
    jersey_number: v.optional(v.union(v.number(), v.null())),
    jersey_name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { playerId, ...updates } = args;
    await ctx.db.patch(playerId, updates);
    return playerId;
  },
});

// Add new team
export const addTeam = mutation({
  args: {
    name: v.string(),
    logo_url: v.string(),
    base_budget: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teams", {
      name: args.name,
      logo_url: args.logo_url,
      base_budget: args.base_budget,
      current_balance: args.base_budget,
      players_count: 0,
    });
  },
});

// Update existing team
export const updateTeam = mutation({
  args: {
    teamId: v.id("teams"),
    name: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    base_budget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { teamId, ...updates } = args;
    
    // If base_budget is updated, recalculate current_balance
    if (updates.base_budget !== undefined) {
      const team = await ctx.db.get(teamId);
      if (team) {
        const spent = team.base_budget - team.current_balance;
        updates.current_balance = updates.base_budget - spent;
      }
    }
    
    await ctx.db.patch(teamId, updates);
    return teamId;
  },
});

// Delete auction result and refund team
export const deleteAuctionResult = mutation({
  args: {
    resultId: v.id("auction_results"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.resultId);
    
    if (!result) {
      throw new Error("Auction result not found");
    }
    
    // Refund the team
    const team = await ctx.db.get(result.team_id);
    if (team) {
      await ctx.db.patch(result.team_id, {
        current_balance: team.current_balance + result.final_amount,
        players_count: Math.max(0, team.players_count - 1),
      });
    }
    
    // Mark player as unsold
    await ctx.db.patch(result.player_id, {
      status: "unsold",
      auction_order: null,
    });
    
    // Delete the result
    await ctx.db.delete(args.resultId);
    
    return args.resultId;
  },
});

// Update auction result (change team/amount)
export const updateAuctionResult = mutation({
  args: {
    resultId: v.id("auction_results"),
    newTeamId: v.id("teams"),
    newAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.resultId);
    
    if (!result) {
      throw new Error("Auction result not found");
    }
    
    const oldTeam = await ctx.db.get(result.team_id);
    const newTeam = await ctx.db.get(args.newTeamId);
    
    if (!newTeam) {
      throw new Error("New team not found");
    }
    
    // Refund old team
    if (oldTeam && result.team_id !== args.newTeamId) {
      await ctx.db.patch(result.team_id, {
        current_balance: oldTeam.current_balance + result.final_amount,
        players_count: Math.max(0, oldTeam.players_count - 1),
      });
    } else if (oldTeam && result.team_id === args.newTeamId) {
      // Same team, just adjust the amount difference
      const amountDiff = result.final_amount - args.newAmount;
      await ctx.db.patch(result.team_id, {
        current_balance: oldTeam.current_balance + amountDiff,
      });
    }
    
    // Charge new team
    if (result.team_id !== args.newTeamId) {
      await ctx.db.patch(args.newTeamId, {
        current_balance: newTeam.current_balance - args.newAmount,
        players_count: newTeam.players_count + 1,
      });
    }
    
    // Update the result
    await ctx.db.patch(args.resultId, {
      team_id: args.newTeamId,
      final_amount: args.newAmount,
    });
    
    return args.resultId;
  },
});
