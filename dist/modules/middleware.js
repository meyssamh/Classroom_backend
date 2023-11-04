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
exports.chosenSessionMiddleware = exports.getAllSessionsMiddleware = exports.chosenStudentMiddleware = exports.getAllStudentsMiddleware = exports.getAllClassesMiddleware = exports.chosenClassMiddleware = exports.handleInputErrors = exports.findEmail = exports.findUser = void 0;
var express_validator_1 = require("express-validator");
var db_1 = __importDefault(require("../db"));
/**
 * Async middleware to find a user with the given username in database.
 *
 * @param req Request from the frontend
 *
 * @returns {Promise} If the user is found in database or not.
 */
var findUser = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.default.teacher.findUnique({
                    where: {
                        username: req.body.username
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findUser = findUser;
/**
 * Async middleware to find an email in database.
 *
 * @param req Request from the frontend
 *
 * @returns {Promise} If the email is found in database or not.
 */
var findEmail = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.default.teacher.findUnique({
                    where: {
                        email: req.body.email
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findEmail = findEmail;
/**
 * Async middleware to handle input errors
 *
 * @param req Request from the frontend
 * @param res Response to the frontend
 * @param next To trigger the next function, that is in the row.
 *
 * @returns {Promise} If the input is correct or not.
 */
var handleInputErrors = function (req, res, next) {
    var errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400);
        res.json({ errors: errors.array() });
    }
    else {
        next();
    }
};
exports.handleInputErrors = handleInputErrors;
/**
 * Async middleware to find a chosen class in database.
 *
 * @param req Request from the frontend
 *
 * @returns {Promise} Chosen class
 */
var chosenClassMiddleware = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var classId, chosenClass;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                classId = parseInt(req.params.class_id);
                return [4 /*yield*/, db_1.default.teacherClass.findFirst({
                        where: {
                            teacher_Id: parseInt(req.teacher.id),
                            class_Id: classId,
                        },
                        select: {
                            id: true,
                            class_Id: true,
                        }
                    })];
            case 1:
                chosenClass = _a.sent();
                return [2 /*return*/, chosenClass];
        }
    });
}); };
exports.chosenClassMiddleware = chosenClassMiddleware;
/**
 * Async middleware to find all classes from a user in database.
 *
 * @param req Request from the frontend
 *
 * @returns {Promise} All classes
 */
var getAllClassesMiddleware = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var teacherClasses, classIds, classes, allClasses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.teacher) return [3 /*break*/, 2];
                return [4 /*yield*/, db_1.default.teacherClass.findMany({
                        where: {
                            teacher_Id: parseInt(req.teacher.id),
                        },
                        select: {
                            class_Id: true
                        }
                    })];
            case 1:
                teacherClasses = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, db_1.default.teacherClass.findMany({
                    where: {
                        teacher_Id: Number(req.id),
                    },
                    select: {
                        class_Id: true
                    }
                })];
            case 3:
                teacherClasses = _a.sent();
                _a.label = 4;
            case 4:
                classIds = teacherClasses.map(function (element) {
                    return element.class_Id;
                });
                return [4 /*yield*/, db_1.default.class.findMany({
                        where: {
                            id: { in: classIds }
                        },
                        select: {
                            id: true,
                            classname: true,
                        }
                    })];
            case 5:
                classes = _a.sent();
                allClasses = classes.map(function (element) {
                    var _id = Number(element.id);
                    return (__assign(__assign({}, element), { id: _id }));
                });
                return [2 /*return*/, allClasses];
        }
    });
}); };
exports.getAllClassesMiddleware = getAllClassesMiddleware;
/**
 * Async middleware to find all students from a chosen class in database.
 *
 * @param {object} chosenClass An object with class id and it's id in teacherClass table.
 *
 * @returns {Promise} All students
 */
var getAllStudentsMiddleware = function (chosenClass) { return __awaiter(void 0, void 0, void 0, function () {
    var classStudents, studentIds, students, allStudents;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.default.classStudent.findMany({
                    where: {
                        class_Id: chosenClass.class_Id,
                    },
                    select: {
                        student_Id: true
                    }
                })];
            case 1:
                classStudents = _a.sent();
                studentIds = classStudents.map(function (element) {
                    return element.student_Id;
                });
                return [4 /*yield*/, db_1.default.student.findMany({
                        where: {
                            id: { in: studentIds }
                        },
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true,
                        }
                    })];
            case 2:
                students = _a.sent();
                allStudents = students.map(function (element) {
                    var _id = Number(element.id);
                    return (__assign(__assign({}, element), { id: _id }));
                });
                console.log(allStudents);
                return [2 /*return*/, allStudents];
        }
    });
}); };
exports.getAllStudentsMiddleware = getAllStudentsMiddleware;
/**
 * Async middleware to find a chosen student in database.
 *
 * @param req Request from the frontend
 *
 * @returns {Promise} Chosen student
 */
var chosenStudentMiddleware = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, chosenClass, chosenStudent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                studentId = parseInt(req.params.student_id);
                return [4 /*yield*/, (0, exports.chosenClassMiddleware)(req)];
            case 1:
                chosenClass = _a.sent();
                return [4 /*yield*/, db_1.default.classStudent.findFirst({
                        where: {
                            class_Id: chosenClass.class_Id,
                            student_Id: studentId,
                        },
                        select: {
                            id: true,
                            student_Id: true,
                        }
                    })];
            case 2:
                chosenStudent = _a.sent();
                return [2 /*return*/, chosenStudent];
        }
    });
}); };
exports.chosenStudentMiddleware = chosenStudentMiddleware;
/**
 * Async middleware to find all session from a chosen class in database.
 *
 * @param {object} chosenClass An object with class id and it's id in teacherClass table.
 *
 * @returns {Promise} All sessions
 */
var getAllSessionsMiddleware = function (chosenClass) { return __awaiter(void 0, void 0, void 0, function () {
    var classSession, sessionIds, sessions, allSessions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.default.classSession.findMany({
                    where: {
                        class_Id: chosenClass.class_Id,
                    },
                    select: {
                        session_Id: true,
                    },
                })];
            case 1:
                classSession = _a.sent();
                sessionIds = classSession.map(function (element) {
                    return element.session_Id;
                });
                return [4 /*yield*/, db_1.default.session.findMany({
                        where: {
                            id: { in: sessionIds },
                        },
                        select: {
                            id: true,
                            date: true,
                            situation: true,
                        },
                    })];
            case 2:
                sessions = _a.sent();
                allSessions = sessions.map(function (element) {
                    var _id = Number(element.id);
                    var _situation = JSON.parse(element.situation);
                    return (__assign(__assign({}, element), { id: _id, situation: _situation }));
                });
                console.log(allSessions);
                return [2 /*return*/, allSessions];
        }
    });
}); };
exports.getAllSessionsMiddleware = getAllSessionsMiddleware;
/**
 * Async middleware to find a chosen session in database.
 *
 * @param req Request from the frontend
 *
 * @returns {Promise} Chosen session
 */
var chosenSessionMiddleware = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionId, chosenClass, chosenSession;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sessionId = parseInt(req.params.session_id);
                return [4 /*yield*/, (0, exports.chosenClassMiddleware)(req)];
            case 1:
                chosenClass = _a.sent();
                return [4 /*yield*/, db_1.default.classSession.findFirst({
                        where: {
                            class_Id: chosenClass.class_Id,
                            session_Id: sessionId,
                        },
                        select: {
                            id: true,
                            session_Id: true,
                        },
                    })];
            case 2:
                chosenSession = _a.sent();
                return [2 /*return*/, chosenSession];
        }
    });
}); };
exports.chosenSessionMiddleware = chosenSessionMiddleware;
