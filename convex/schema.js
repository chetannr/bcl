"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("convex/server");
var values_1 = require("convex/values");
var server_2 = require("@convex-dev/auth/server");
exports.default = (0, server_1.defineSchema)(__assign(__assign({}, server_2.authTables), { teams: (0, server_1.defineTable)({
        name: values_1.v.string(),
        logo_url: values_1.v.string(),
        base_budget: values_1.v.number(),
        current_balance: values_1.v.number(),
        players_count: values_1.v.number(),
    }), players: (0, server_1.defineTable)({
        name: values_1.v.string(),
        age: values_1.v.string(),
        category: values_1.v.string(),
        phone: values_1.v.string(),
        photo_url: values_1.v.string(),
        player_type: values_1.v.string(),
        base_price: values_1.v.number(),
        status: values_1.v.union(values_1.v.literal("unsold"), values_1.v.literal("sold"), values_1.v.literal("bidding")),
        auction_order: values_1.v.union(values_1.v.number(), values_1.v.null()),
        auction_serial_number: values_1.v.union(values_1.v.number(), values_1.v.null()),
        is_valid_player: values_1.v.string(),
        jersey_number: values_1.v.union(values_1.v.number(), values_1.v.null()),
        jersey_name: values_1.v.string(),
    }).index("by_status", ["status"]), auction_state: (0, server_1.defineTable)({
        current_player_id: values_1.v.union(values_1.v.id("players"), values_1.v.null()),
        is_auction_active: values_1.v.boolean(),
        is_bidding_open: values_1.v.boolean(),
    }), auction_results: (0, server_1.defineTable)({
        player_id: values_1.v.id("players"),
        team_id: values_1.v.id("teams"),
        final_amount: values_1.v.number(),
        auction_order: values_1.v.number(),
    }).index("by_auction_order", ["auction_order"]) }));
