"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var class_1 = require("./handlers/class");
var student_1 = require("./handlers/student");
var session_1 = require("./handlers/session");
var inputValidators_1 = require("./modules/inputValidators");
var middleware_1 = require("./modules/middleware");
var router = (0, express_1.Router)();
// Class
router.get('/class', class_1.getAllClasses);
router.get('/class/:class_id', class_1.getOneClass);
router.post('/class', inputValidators_1.classValidator, middleware_1.handleInputErrors, class_1.createClass);
router.put('/class/:class_id', inputValidators_1.classValidator, middleware_1.handleInputErrors, class_1.updateClass);
router.delete('/class/:class_id', class_1.deleteClass);
// Student
router.get('/student/:class_id', student_1.getAllStudents);
router.get('/student/:class_id/:student_id', student_1.getOneStudent);
router.post('/student/:class_id', inputValidators_1.studentValidator, middleware_1.handleInputErrors, student_1.createStudent);
router.put('/student/:class_id/:student_id', inputValidators_1.studentValidator, middleware_1.handleInputErrors, student_1.updateStudent);
router.delete('/student/:class_id/:student_id', student_1.deleteStudent);
// Session
router.get('/session/:class_id', session_1.getAllSessions);
router.get('/session/:class_id/:session_id', session_1.getOneSession);
router.post('/session/:class_id', inputValidators_1.sessionValidator, middleware_1.handleInputErrors, session_1.createSession);
router.put('/session/:class_id/:session_id', inputValidators_1.sessionValidator, middleware_1.handleInputErrors, session_1.updateSession);
router.delete('/session/:class_id/:session_id', session_1.deleteSession);
router.use(function (err, req, res, next) {
    if (err.type === 'auth') {
        res.status(401).json({ message: 'unauthorized' });
    }
    else if (err.type === 'input') {
        res.status(400).json({ message: 'invalid input' });
    }
    else {
        res.status(500).json({ message: 'server error' });
    }
});
exports.default = router;
