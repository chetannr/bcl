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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeam = exports.getTeamAuctionResults = exports.getAuctionResults = exports.getCurrentPlayer = exports.getAuctionState = exports.getPlayer = exports.getPlayers = exports.getTeams = void 0;
var server_1 = require("./_generated/server");
var values_1 = require("convex/values");
// Get all teams ordered by name
exports.getTeams = (0, server_1.query)({
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var teams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("teams").collect()];
                case 1:
                    teams = _a.sent();
                    return [2 /*return*/, teams.sort(function (a, b) { return a.name.localeCompare(b.name); })];
            }
        });
    }); },
});
// Get players filtered by status
exports.getPlayers = (0, server_1.query)({
    args: {
        status: values_1.v.optional(values_1.v.union(values_1.v.literal("unsold"), values_1.v.literal("sold"), values_1.v.literal("bidding"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var players;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!args.status) return [3 /*break*/, 2];
                    return [4 /*yield*/, ctx.db
                            .query("players")
                            .withIndex("by_status", function (q) { return q.eq("status", args.status); })
                            .collect()];
                case 1:
                    players = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, ctx.db.query("players").collect()];
                case 3:
                    players = _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, players.sort(function (a, b) { return a.name.localeCompare(b.name); })];
            }
        });
    }); },
});
// Get single player by ID
exports.getPlayer = (0, server_1.query)({
    args: {
        playerId: values_1.v.union(values_1.v.id("players"), values_1.v.null()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!args.playerId) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, ctx.db.get(args.playerId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Get current auction state
exports.getAuctionState = (0, server_1.query)({
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var states;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("auction_state").collect()];
                case 1:
                    states = _a.sent();
                    return [2 /*return*/, states[0] || null];
            }
        });
    }); },
});
// Get current player (combines auction state + player lookup)
exports.getCurrentPlayer = (0, server_1.query)({
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var states, state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("auction_state").collect()];
                case 1:
                    states = _a.sent();
                    state = states[0];
                    if (!state || !state.current_player_id) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, ctx.db.get(state.current_player_id)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Get all auction results with player and team data
exports.getAuctionResults = (0, server_1.query)({
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var results, enrichedResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("auction_results")
                        .withIndex("by_auction_order")
                        .collect()];
                case 1:
                    results = _a.sent();
                    return [4 /*yield*/, Promise.all(results.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                            var player, team;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ctx.db.get(result.player_id)];
                                    case 1:
                                        player = _a.sent();
                                        return [4 /*yield*/, ctx.db.get(result.team_id)];
                                    case 2:
                                        team = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, result), { player: player, team: team })];
                                }
                            });
                        }); }))];
                case 2:
                    enrichedResults = _a.sent();
                    return [2 /*return*/, enrichedResults];
            }
        });
    }); },
});
// Get auction results for a specific team
exports.getTeamAuctionResults = (0, server_1.query)({
    args: {
        teamId: values_1.v.id("teams"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var results, teamResults, enrichedResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("auction_results")
                        .collect()];
                case 1:
                    results = _a.sent();
                    teamResults = results.filter(function (r) { return r.team_id === args.teamId; });
                    return [4 /*yield*/, Promise.all(teamResults.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                            var player;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ctx.db.get(result.player_id)];
                                    case 1:
                                        player = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, result), { player: player })];
                                }
                            });
                        }); }))];
                case 2:
                    enrichedResults = _a.sent();
                    return [2 /*return*/, enrichedResults.sort(function (a, b) { return a.auction_order - b.auction_order; })];
            }
        });
    }); },
});
// Get team with calculated current balance
exports.getTeam = (0, server_1.query)({
    args: {
        teamId: values_1.v.id("teams"),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.teamId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
