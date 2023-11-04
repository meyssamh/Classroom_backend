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
exports.deleteClass = exports.updateClass = exports.createClass = exports.getOneClass = exports.getAllClasses = void 0;
var db_1 = __importDefault(require("../db"));
var middleware_1 = require("../modules/middleware");
// Get all classes
var getAllClasses = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allClasses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, middleware_1.getAllClassesMiddleware)(req)];
            case 1:
                allClasses = _a.sent();
                res.status(200).json({ data: { classes: allClasses } });
                return [2 /*return*/];
        }
    });
}); };
exports.getAllClasses = getAllClasses;
// Get one class
var getOneClass = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chosenClass, classInformation, selectedClass, allStudents, allSessions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, middleware_1.chosenClassMiddleware)(req)];
            case 1:
                chosenClass = _a.sent();
                if (chosenClass === null) {
                    return [2 /*return*/, res.status(400).json({ message: 'Something went wrong!' })];
                }
                return [4 /*yield*/, db_1.default.class.findUnique({
                        where: {
                            id: chosenClass.class_Id
                        },
                        select: {
                            id: true,
                            classname: true,
                        }
                    })];
            case 2:
                classInformation = _a.sent();
                selectedClass = __assign(__assign({}, classInformation), { id: Number(classInformation.id) });
                return [4 /*yield*/, (0, middleware_1.getAllStudentsMiddleware)(chosenClass)];
            case 3:
                allStudents = _a.sent();
                return [4 /*yield*/, (0, middleware_1.getAllSessionsMiddleware)(chosenClass)];
            case 4:
                allSessions = _a.sent();
                res.status(200).json({
                    data: {
                        class: selectedClass,
                        students: allStudents,
                        sessions: allSessions
                    }
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getOneClass = getOneClass;
// Create class
var createClass = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var classname, newClass, newClassId, handeledNewClass;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                classname = req.body.classname.trim();
                if (classname.length === 0) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                return [4 /*yield*/, db_1.default.class.create({
                        data: {
                            classname: classname,
                        },
                        select: {
                            id: true,
                            classname: true,
                        }
                    })];
            case 1:
                newClass = _a.sent();
                return [4 /*yield*/, db_1.default.teacherClass.create({
                        data: {
                            teacher_Id: parseInt(req.teacher.id),
                            class_Id: newClass.id
                        },
                    })];
            case 2:
                _a.sent();
                newClassId = Number(newClass.id);
                return [4 /*yield*/, db_1.default.historyLog.create({
                        data: {
                            teacher_Id: parseInt(req.teacher.id),
                            activity: "added a new class with id ".concat(newClassId),
                        }
                    })];
            case 3:
                _a.sent();
                handeledNewClass = __assign(__assign({}, newClass), { id: newClassId });
                res.status(200).json({ data: { newClass: handeledNewClass } });
                return [2 /*return*/];
        }
    });
}); };
exports.createClass = createClass;
// Update class
var updateClass = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var classname, chosenClass, updatedClass, updatedClassId, handeledUpdatedClass;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                classname = req.body.classname.trim();
                if (classname.length === 0) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                return [4 /*yield*/, (0, middleware_1.chosenClassMiddleware)(req)];
            case 1:
                chosenClass = _a.sent();
                if (chosenClass === null) {
                    return [2 /*return*/, res.status(400).json({ message: 'Something went wrong!' })];
                }
                return [4 /*yield*/, db_1.default.class.update({
                        where: {
                            id: chosenClass.class_Id,
                        },
                        data: {
                            classname: classname,
                        },
                        select: {
                            id: true,
                            classname: true,
                        }
                    })];
            case 2:
                updatedClass = _a.sent();
                updatedClassId = Number(updatedClass.id);
                return [4 /*yield*/, db_1.default.historyLog.create({
                        data: {
                            teacher_Id: parseInt(req.teacher.id),
                            activity: "updated an existing class with id ".concat(updatedClassId),
                        }
                    })];
            case 3:
                _a.sent();
                handeledUpdatedClass = __assign(__assign({}, updatedClass), { id: updatedClassId });
                res.status(200).json({ data: { updatedClass: handeledUpdatedClass } });
                return [2 /*return*/];
        }
    });
}); };
exports.updateClass = updateClass;
// Delete class
var deleteClass = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chosenClass, chosenStudents, chosenStudentsIds, chosenSessions, chosenSessionsIds, deletedClass, deletedClassId, handeledDeletedClass;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, middleware_1.chosenClassMiddleware)(req)];
            case 1:
                chosenClass = _a.sent();
                if (chosenClass === null) {
                    return [2 /*return*/, res.status(400).json({ message: 'Something went wrong!' })];
                }
                return [4 /*yield*/, db_1.default.teacherClass.delete({
                        where: {
                            id: chosenClass.id
                        }
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, db_1.default.classStudent.findMany({
                        where: {
                            class_Id: chosenClass.class_Id,
                        },
                        select: {
                            student_Id: true,
                        }
                    })];
            case 3:
                chosenStudents = _a.sent();
                chosenStudentsIds = chosenStudents.map(function (classStudents) {
                    return classStudents.student_Id;
                });
                return [4 /*yield*/, db_1.default.classStudent.deleteMany({
                        where: {
                            class_Id: chosenClass.id
                        }
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, db_1.default.student.deleteMany({
                        where: {
                            id: {
                                in: chosenStudentsIds
                            },
                        }
                    })];
            case 5:
                _a.sent();
                return [4 /*yield*/, db_1.default.classSession.findMany({
                        where: {
                            class_Id: chosenClass.class_Id,
                        },
                        select: {
                            session_Id: true,
                        },
                    })];
            case 6:
                chosenSessions = _a.sent();
                chosenSessionsIds = chosenSessions.map(function (classSessions) {
                    return classSessions.session_Id;
                });
                return [4 /*yield*/, db_1.default.classSession.deleteMany({
                        where: {
                            class_Id: chosenClass.id
                        },
                    })];
            case 7:
                _a.sent();
                return [4 /*yield*/, db_1.default.session.deleteMany({
                        where: {
                            id: {
                                in: chosenSessionsIds
                            }
                        }
                    })];
            case 8:
                _a.sent();
                return [4 /*yield*/, db_1.default.class.delete({
                        where: {
                            id: chosenClass.class_Id,
                        },
                        select: {
                            id: true,
                            classname: true,
                        }
                    })];
            case 9:
                deletedClass = _a.sent();
                deletedClassId = Number(deletedClass.id);
                return [4 /*yield*/, db_1.default.historyLog.create({
                        data: {
                            teacher_Id: parseInt(req.teacher.id),
                            activity: "deleted an existing class with id ".concat(deletedClassId),
                        }
                    })];
            case 10:
                _a.sent();
                handeledDeletedClass = __assign(__assign({}, deletedClass), { id: deletedClassId });
                res.status(200).json({ data: { deletedClass: handeledDeletedClass } });
                return [2 /*return*/];
        }
    });
}); };
exports.deleteClass = deleteClass;
