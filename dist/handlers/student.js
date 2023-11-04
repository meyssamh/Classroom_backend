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
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getOneStudent = exports.getAllStudents = void 0;
var db_1 = __importDefault(require("../db"));
var middleware_1 = require("../modules/middleware");
// Get all students
var getAllStudents = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chosenClass, allStudents;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, middleware_1.chosenClassMiddleware)(req)];
            case 1:
                chosenClass = _a.sent();
                return [4 /*yield*/, (0, middleware_1.getAllStudentsMiddleware)(chosenClass)];
            case 2:
                allStudents = _a.sent();
                res.json({ data: { students: allStudents } });
                return [2 /*return*/];
        }
    });
}); };
exports.getAllStudents = getAllStudents;
// Get one student
var getOneStudent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chosenStudent, studentInformation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, middleware_1.chosenStudentMiddleware)(req)];
            case 1:
                chosenStudent = _a.sent();
                if (chosenStudent === null) {
                    return [2 /*return*/, res.status(400).json({ message: 'Something went wrong!' })];
                }
                return [4 /*yield*/, db_1.default.student.findFirst({
                        where: {
                            id: chosenStudent.student_Id,
                        },
                        select: {
                            firstname: true,
                            lastname: true,
                        },
                    })];
            case 2:
                studentInformation = _a.sent();
                res.json({ data: { student: studentInformation } });
                return [2 /*return*/];
        }
    });
}); };
exports.getOneStudent = getOneStudent;
// Create student
var createStudent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nameRegex, firstname, lastname, classId, chosenClass, newStudent, newStudentId, handeledNewStudent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nameRegex = /^[a-zA-Z]+$/;
                firstname = req.body.firstname.trim();
                lastname = req.body.lastname.trim();
                if (firstname.length === 0 || !firstname.match(nameRegex)) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                else if (lastname.length === 0 || !lastname.match(nameRegex)) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                classId = parseInt(req.params.class_id);
                return [4 /*yield*/, db_1.default.teacherClass.findFirst({
                        where: {
                            teacher_Id: parseInt(req.teacher.id),
                            class_Id: classId,
                        },
                        select: {
                            class_Id: true,
                        }
                    })];
            case 1:
                chosenClass = _a.sent();
                return [4 /*yield*/, db_1.default.student.create({
                        data: {
                            firstname: firstname,
                            lastname: lastname,
                        },
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true,
                        }
                    })];
            case 2:
                newStudent = _a.sent();
                return [4 /*yield*/, db_1.default.classStudent.create({
                        data: {
                            class_Id: chosenClass.class_Id,
                            student_Id: newStudent.id,
                        },
                    })];
            case 3:
                _a.sent();
                newStudentId = Number(newStudent.id);
                return [4 /*yield*/, db_1.default.historyLog.create({
                        data: {
                            teacher_Id: parseInt(req.teacher.id),
                            activity: "created student with id ".concat(newStudentId),
                        },
                    })];
            case 4:
                _a.sent();
                handeledNewStudent = __assign(__assign({}, newStudent), { id: newStudentId });
                res.json({ data: { newStudent: handeledNewStudent } });
                return [2 /*return*/];
        }
    });
}); };
exports.createStudent = createStudent;
// Update student
var updateStudent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var nameRegex, firstname, lastname, chosenStudent, updatedStudent, updatedStudentId, handeledUpdatedStudent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nameRegex = /^[a-zA-Z]+$/;
                firstname = req.body.firstname.trim();
                lastname = req.body.lastname.trim();
                if (firstname.length === 0 || !firstname.match(nameRegex)) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                else if (lastname.length === 0 || !lastname.match(nameRegex)) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid input!' })];
                }
                return [4 /*yield*/, (0, middleware_1.chosenStudentMiddleware)(req)];
            case 1:
                chosenStudent = _a.sent();
                if (chosenStudent === null) {
                    return [2 /*return*/, res.status(400).json({ message: 'Something went wrong!' })];
                }
                return [4 /*yield*/, db_1.default.student.update({
                        where: {
                            id: chosenStudent.student_Id,
                        },
                        data: {
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                        },
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true,
                        }
                    })];
            case 2:
                updatedStudent = _a.sent();
                updatedStudentId = Number(updatedStudent.id);
                return [4 /*yield*/, db_1.default.historyLog.create({
                        data: {
                            teacher_Id: parseInt(req.teacher.id),
                            activity: "updated an existing student with id ".concat(updatedStudentId),
                        },
                    })];
            case 3:
                _a.sent();
                handeledUpdatedStudent = __assign(__assign({}, updatedStudent), { id: updatedStudentId });
                res.json({ data: { updatedStudent: handeledUpdatedStudent } });
                return [2 /*return*/];
        }
    });
}); };
exports.updateStudent = updateStudent;
// Delete student
var deleteStudent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var chosenStudent, deletedStudent, deletedStudentId, handeledDeletedStudent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, middleware_1.chosenStudentMiddleware)(req)];
            case 1:
                chosenStudent = _a.sent();
                if (chosenStudent === null) {
                    return [2 /*return*/, res.status(400).json({ message: 'Something went wrong!' })];
                }
                return [4 /*yield*/, db_1.default.classStudent.delete({
                        where: {
                            id: chosenStudent.id
                        }
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, db_1.default.student.delete({
                        where: {
                            id: chosenStudent.student_Id,
                        },
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true,
                        }
                    })];
            case 3:
                deletedStudent = _a.sent();
                deletedStudentId = Number(deletedStudent.id);
                return [4 /*yield*/, db_1.default.historyLog.create({
                        data: {
                            teacher_Id: parseInt(req.teacher.id),
                            activity: "deleted an existing student with id ".concat(deletedStudentId),
                        },
                    })];
            case 4:
                _a.sent();
                handeledDeletedStudent = __assign(__assign({}, deletedStudent), { id: deletedStudentId });
                res.json({ data: { deletedStudent: handeledDeletedStudent } });
                return [2 /*return*/];
        }
    });
}); };
exports.deleteStudent = deleteStudent;
