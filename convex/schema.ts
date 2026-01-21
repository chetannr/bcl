import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  teams: defineTable({
    name: v.string(),
    logo_url: v.string(),
    base_budget: v.number(),
    current_balance: v.number(),
    players_count: v.number(),
  }),

  players: defineTable({
    name: v.string(),
    age: v.string(),
    category: v.string(),
    phone: v.string(),
    photo_url: v.string(),
    player_type: v.string(),
    base_price: v.number(),
    status: v.union(
      v.literal("unsold"),
      v.literal("sold"),
      v.literal("bidding")
    ),
    auction_order: v.union(v.number(), v.null()),
    auction_serial_number: v.union(v.number(), v.null()),
    is_valid_player: v.string(),
    jersey_number: v.union(v.number(), v.null()),
    jersey_name: v.string(),
  }).index("by_status", ["status"]),

  auction_state: defineTable({
    current_player_id: v.union(v.id("players"), v.null()),
    is_auction_active: v.boolean(),
    is_bidding_open: v.boolean(),
  }),

  auction_results: defineTable({
    player_id: v.id("players"),
    team_id: v.id("teams"),
    final_amount: v.number(),
    auction_order: v.number(),
  }).index("by_auction_order", ["auction_order"]),
});
