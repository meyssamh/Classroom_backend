"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
var lodash_merge_1 = __importDefault(require("lodash.merge"));
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var stage = process.env.STAGE || 'local';
var envConfig;
if (stage === 'production') {
    envConfig = require('./prod').default;
}
else if (stage === 'testing') {
    envConfig = require('./testing').default;
}
else {
    envConfig = require('./local').default;
}
var defaultConfig = {
    stage: stage,
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    cookieMaxAge: process.env.COOKIE_MAX_AGE,
    port: process.env.PORT,
    logging: false,
};
exports.default = (0, lodash_merge_1.default)(defaultConfig, envConfig);
