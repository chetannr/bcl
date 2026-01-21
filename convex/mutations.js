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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAuctionResult = exports.deleteAuctionResult = exports.updateTeam = exports.addTeam = exports.updatePlayer = exports.addPlayer = exports.markPlayerUnsold = exports.sellPlayer = exports.setNextPlayer = exports.updateAuctionState = void 0;
var server_1 = require("./_generated/server");
var values_1 = require("convex/values");
// Update auction state
exports.updateAuctionState = (0, server_1.mutation)({
    args: {
        current_player_id: values_1.v.optional(values_1.v.union(values_1.v.id("players"), values_1.v.null())),
        is_auction_active: values_1.v.optional(values_1.v.boolean()),
        is_bidding_open: values_1.v.optional(values_1.v.boolean()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var states, state;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, ctx.db.query("auction_state").collect()];
                case 1:
                    states = _d.sent();
                    if (!(states.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.insert("auction_state", {
                            current_player_id: (_a = args.current_player_id) !== null && _a !== void 0 ? _a : null,
                            is_auction_active: (_b = args.is_auction_active) !== null && _b !== void 0 ? _b : false,
                            is_bidding_open: (_c = args.is_bidding_open) !== null && _c !== void 0 ? _c : false,
                        })];
                case 2: 
                // Create if doesn't exist
                return [2 /*return*/, _d.sent()];
                case 3:
                    state = states[0];
                    return [4 /*yield*/, ctx.db.patch(state._id, __assign(__assign(__assign({}, (args.current_player_id !== undefined && { current_player_id: args.current_player_id })), (args.is_auction_active !== undefined && { is_auction_active: args.is_auction_active })), (args.is_bidding_open !== undefined && { is_bidding_open: args.is_bidding_open })))];
                case 4:
                    _d.sent();
                    return [2 /*return*/, state._id];
            }
        });
    }); },
});
// Set next player and open bidding
exports.setNextPlayer = (0, server_1.mutation)({
    args: {
        playerId: values_1.v.union(values_1.v.id("players"), values_1.v.null()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var states, state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("auction_state").collect()];
                case 1:
                    states = _a.sent();
                    if (!(states.length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.insert("auction_state", {
                            current_player_id: args.playerId,
                            is_auction_active: true,
                            is_bidding_open: args.playerId ? true : false,
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    state = states[0];
                    return [4 /*yield*/, ctx.db.patch(state._id, {
                            current_player_id: args.playerId,
                            is_bidding_open: args.playerId ? true : false,
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, state._id];
            }
        });
    }); },
});
// Sell player to team
exports.sellPlayer = (0, server_1.mutation)({
    args: {
        playerId: values_1.v.id("players"),
        teamId: values_1.v.id("teams"),
        amount: values_1.v.number(),
        auctionOrder: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var resultId, team;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("auction_results", {
                        player_id: args.playerId,
                        team_id: args.teamId,
                        final_amount: args.amount,
                        auction_order: args.auctionOrder,
                    })];
                case 1:
                    resultId = _a.sent();
                    // Update player status
                    return [4 /*yield*/, ctx.db.patch(args.playerId, {
                            status: "sold",
                            auction_order: args.auctionOrder,
                        })];
                case 2:
                    // Update player status
                    _a.sent();
                    return [4 /*yield*/, ctx.db.get(args.teamId)];
                case 3:
                    team = _a.sent();
                    if (!team) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.db.patch(args.teamId, {
                            current_balance: team.current_balance - args.amount,
                            players_count: team.players_count + 1,
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, resultId];
            }
        });
    }); },
});
// Mark player as unsold
exports.markPlayerUnsold = (0, server_1.mutation)({
    args: {
        playerId: values_1.v.id("players"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.patch(args.playerId, {
                        status: "unsold",
                        auction_order: null,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, args.playerId];
            }
        });
    }); },
});
// Add new player
exports.addPlayer = (0, server_1.mutation)({
    args: {
        name: values_1.v.string(),
        age: values_1.v.string(),
        category: values_1.v.string(),
        phone: values_1.v.string(),
        photo_url: values_1.v.string(),
        player_type: values_1.v.string(),
        base_price: values_1.v.number(),
        auction_serial_number: values_1.v.union(values_1.v.number(), values_1.v.null()),
        is_valid_player: values_1.v.string(),
        jersey_number: values_1.v.union(values_1.v.number(), values_1.v.null()),
        jersey_name: values_1.v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("players", {
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
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Update existing player
exports.updatePlayer = (0, server_1.mutation)({
    args: {
        playerId: values_1.v.id("players"),
        name: values_1.v.optional(values_1.v.string()),
        age: values_1.v.optional(values_1.v.string()),
        category: values_1.v.optional(values_1.v.string()),
        phone: values_1.v.optional(values_1.v.string()),
        photo_url: values_1.v.optional(values_1.v.string()),
        player_type: values_1.v.optional(values_1.v.string()),
        base_price: values_1.v.optional(values_1.v.number()),
        auction_serial_number: values_1.v.optional(values_1.v.union(values_1.v.number(), values_1.v.null())),
        is_valid_player: values_1.v.optional(values_1.v.string()),
        jersey_number: values_1.v.optional(values_1.v.union(values_1.v.number(), values_1.v.null())),
        jersey_name: values_1.v.optional(values_1.v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var playerId, updates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    playerId = args.playerId, updates = __rest(args, ["playerId"]);
                    return [4 /*yield*/, ctx.db.patch(playerId, updates)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, playerId];
            }
        });
    }); },
});
// Add new team
exports.addTeam = (0, server_1.mutation)({
    args: {
        name: values_1.v.string(),
        logo_url: values_1.v.string(),
        base_budget: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("teams", {
                        name: args.name,
                        logo_url: args.logo_url,
                        base_budget: args.base_budget,
                        current_balance: args.base_budget,
                        players_count: 0,
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Update existing team
exports.updateTeam = (0, server_1.mutation)({
    args: {
        teamId: values_1.v.id("teams"),
        name: values_1.v.optional(values_1.v.string()),
        logo_url: values_1.v.optional(values_1.v.string()),
        base_budget: values_1.v.optional(values_1.v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var teamId, updates, team, spent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    teamId = args.teamId, updates = __rest(args, ["teamId"]);
                    if (!(updates.base_budget !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, ctx.db.get(teamId)];
                case 1:
                    team = _a.sent();
                    if (team) {
                        spent = team.base_budget - team.current_balance;
                        updates.current_balance = updates.base_budget - spent;
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, ctx.db.patch(teamId, updates)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, teamId];
            }
        });
    }); },
});
// Delete auction result and refund team
exports.deleteAuctionResult = (0, server_1.mutation)({
    args: {
        resultId: values_1.v.id("auction_results"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var result, team;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.resultId)];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        throw new Error("Auction result not found");
                    }
                    return [4 /*yield*/, ctx.db.get(result.team_id)];
                case 2:
                    team = _a.sent();
                    if (!team) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db.patch(result.team_id, {
                            current_balance: team.current_balance + result.final_amount,
                            players_count: Math.max(0, team.players_count - 1),
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: 
                // Mark player as unsold
                return [4 /*yield*/, ctx.db.patch(result.player_id, {
                        status: "unsold",
                        auction_order: null,
                    })];
                case 5:
                    // Mark player as unsold
                    _a.sent();
                    // Delete the result
                    return [4 /*yield*/, ctx.db.delete(args.resultId)];
                case 6:
                    // Delete the result
                    _a.sent();
                    return [2 /*return*/, args.resultId];
            }
        });
    }); },
});
// Update auction result (change team/amount)
exports.updateAuctionResult = (0, server_1.mutation)({
    args: {
        resultId: values_1.v.id("auction_results"),
        newTeamId: values_1.v.id("teams"),
        newAmount: values_1.v.number(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var result, oldTeam, newTeam, amountDiff;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.resultId)];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        throw new Error("Auction result not found");
                    }
                    return [4 /*yield*/, ctx.db.get(result.team_id)];
                case 2:
                    oldTeam = _a.sent();
                    return [4 /*yield*/, ctx.db.get(args.newTeamId)];
                case 3:
                    newTeam = _a.sent();
                    if (!newTeam) {
                        throw new Error("New team not found");
                    }
                    if (!(oldTeam && result.team_id !== args.newTeamId)) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.db.patch(result.team_id, {
                            current_balance: oldTeam.current_balance + result.final_amount,
                            players_count: Math.max(0, oldTeam.players_count - 1),
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    if (!(oldTeam && result.team_id === args.newTeamId)) return [3 /*break*/, 7];
                    amountDiff = result.final_amount - args.newAmount;
                    return [4 /*yield*/, ctx.db.patch(result.team_id, {
                            current_balance: oldTeam.current_balance + amountDiff,
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    if (!(result.team_id !== args.newTeamId)) return [3 /*break*/, 9];
                    return [4 /*yield*/, ctx.db.patch(args.newTeamId, {
                            current_balance: newTeam.current_balance - args.newAmount,
                            players_count: newTeam.players_count + 1,
                        })];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: 
                // Update the result
                return [4 /*yield*/, ctx.db.patch(args.resultId, {
                        team_id: args.newTeamId,
                        final_amount: args.newAmount,
                    })];
                case 10:
                    // Update the result
                    _a.sent();
                    return [2 /*return*/, args.resultId];
            }
        });
    }); },
});
