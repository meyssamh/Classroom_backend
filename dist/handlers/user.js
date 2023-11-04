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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.createNewUser = void 0;
var db_1 = __importDefault(require("../db"));
var auth_1 = require("../modules/auth");
var middleware_1 = require("../modules/middleware");
// Create new user
var createNewUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nameRegex, emailRegex, firstname, lastname, email, username, password, confirmPassword, createdUsers, emailExists, hashedPassword, user, serialized, token, name;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nameRegex = /^[a-zA-Z]+$/;
                emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                firstname = req.body.firstname.trim();
                lastname = req.body.lastname.trim();
                email = req.body.email.trim();
                username = req.body.username.trim();
                password = req.body.password.trim();
                confirmPassword = req.body.confirmPassword.trim();
                if (firstname.length > 0 && !firstname.match(nameRegex)) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                else if (lastname.trim().length > 0 && !lastname.match(nameRegex)) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                else if (!email.match(emailRegex) ||
                    email.length === 0 ||
                    username.length < 4 ||
                    password.length < 8 ||
                    password !== confirmPassword) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                return [4 /*yield*/, (0, middleware_1.findUser)(req)];
            case 1:
                createdUsers = _a.sent();
                if (createdUsers) {
                    return [2 /*return*/, res.status(400).json({ message: 'Username is taken!' })];
                }
                return [4 /*yield*/, (0, middleware_1.findEmail)(req)];
            case 2:
                emailExists = _a.sent();
                if (emailExists) {
                    return [2 /*return*/, res.status(400).json({ message: 'E-mail already exists!' })];
                }
                return [4 /*yield*/, (0, auth_1.hashPassword)(req.body.password)];
            case 3:
                hashedPassword = _a.sent();
                return [4 /*yield*/, db_1.default.teacher.create({
                        data: {
                            username: username,
                            email: email,
                            password: hashedPassword
                        }
                    })];
            case 4:
                user = _a.sent();
                serialized = __assign(__assign({}, user), { id: user.id.toString() });
                token = (0, auth_1.createJWT)(serialized);
                name = {
                    username: req.body.username ? req.body.username : '',
                    firsname: req.body.firstname ? req.body.firstname : '',
                    lastname: req.body.lastname ? req.body.lastname : ''
                };
                res.status(200).cookie('access_token', 'Bearer ' + token, {
                    expires: new Date(Date.now() + process.env.COOKIE_MAX_AGE),
                    httpOnly: true,
                    secure: true,
                    maxAge: process.env.COOKIE_MAX_AGE,
                }).json({ data: name });
                return [2 /*return*/];
        }
    });
}); };
exports.createNewUser = createNewUser;
// Sign in
var signin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, password, user, isValid, serialized, token, name;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.body.username.trim();
                password = req.body.password.trim();
                if (username.length < 4 || password.length < 8) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                return [4 /*yield*/, (0, middleware_1.findUser)(req)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: 'Wrong Username or Password!' })];
                }
                return [4 /*yield*/, (0, auth_1.comparePassword)(password, user.password)];
            case 2:
                isValid = _a.sent();
                if (!isValid) {
                    return [2 /*return*/, res.status(401).json({ message: 'Wrong Username or Password!' })];
                }
                serialized = __assign(__assign({}, user), { id: user.id.toString() });
                token = (0, auth_1.createJWT)(serialized);
                name = {
                    username: user.username,
                    firstname: user.firstname ? user.firstname : '',
                    lastname: user.lastname ? user.lastname : ''
                };
                console.log(token);
                res.status(200).cookie('access_token', 'Bearer ' + token, {
                    expires: new Date(Date.now() + process.env.COOKIE_MAX_AGE),
                    // httpOnly: true,
                    secure: true,
                    maxAge: process.env.COOKIE_MAX_AGE,
                }).json({
                    data: { user: name }
                });
                return [2 /*return*/];
        }
    });
}); };
exports.signin = signin;
