import { Router } from 'express';

import {
    getAllClasses,
    getOneClass,
    createClass,
    updateClass,
    deleteClass,
} from './handlers/class';
import {
    getAllStudents,
    getOneStudent,
    createStudent,
    updateStudent,
    deleteStudent,
} from './handlers/student';
import {
    getAllSessions,
    getOneSession,
    createSession,
    updateSession,
    deleteSession,
} from './handlers/session';
import { classValidator, studentValidator, sessionValidator } from './modules/inputValidators';
import { handleInputErrors } from './modules/middleware';

const router = Router();
 
// Class
router.get('/class', getAllClasses);
router.get('/class/:class_id', getOneClass);
router.post('/class', classValidator, handleInputErrors, createClass);
router.put('/class/:class_id', classValidator, handleInputErrors, updateClass);
router.delete('/class/:class_id', deleteClass);

// Student
router.get('/student/:class_id', getAllStudents);
router.get('/student/:class_id/:student_id', getOneStudent);
router.post('/student/:class_id', studentValidator, handleInputErrors, createStudent);
router.put('/student/:class_id/:student_id', studentValidator, handleInputErrors, updateStudent);
router.delete('/student/:class_id/:student_id', deleteStudent);

// Session
router.get('/session/:class_id', getAllSessions);
router.get('/session/:class_id/:session_id', getOneSession);
router.post('/session/:class_id', sessionValidator, handleInputErrors, createSession);
router.put('/session/:class_id/:session_id', sessionValidator, handleInputErrors, updateSession);
router.delete('/session/:class_id/:session_id', deleteSession);

router.use((err, req, res, next) => {
    if (err.type === 'auth') {
        res.status(401).json({ message: 'unauthorized' });
    } else if (err.type === 'input') {
        res.status(400).json({ message: 'invalid input' });
    } else {
        res.status(500).json({ message: 'server error' });
    }
});

export default router;