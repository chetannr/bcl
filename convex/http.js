"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("convex/server");
var auth_config_1 = require("./auth.config");
var http = (0, server_1.httpRouter)();
auth_config_1.auth.addHttpRoutes(http);
exports.default = http;
