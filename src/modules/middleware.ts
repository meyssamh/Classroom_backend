import { validationResult } from 'express-validator';

import prisma from '../db';

/**
 * Async middleware to find a user with the given username in database.
 * 
 * @param req Request from the frontend
 * 
 * @returns {Promise} If the user is found in database or not.
 */
export const findUser = async req => {
	return await prisma.teacher.findUnique({
		where: {
			username: req.body.username
		}
	});
};

/**
 * Async middleware to find an email in database.
 * 
 * @param req Request from the frontend
 * 
 * @returns {Promise} If the email is found in database or not.
 */
export const findEmail = async req => {
	return await prisma.teacher.findUnique({
		where: {
			email: req.body.email
		}
	});
};

/**
 * Async middleware to handle input errors
 * 
 * @param req Request from the frontend
 * @param res Response to the frontend
 * @param next To trigger the next function, that is in the row.
 * 
 * @returns {Promise} If the input is correct or not.
 */
export const handleInputErrors = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400);
		res.json({ errors: errors.array() });
	} else {
		next();
	}
};

/**
 * Async middleware to find a chosen class in database.
 * 
 * @param req Request from the frontend
 * 
 * @returns {Promise} Chosen class
 */
export const chosenClassMiddleware = async req => {
	const classId = parseInt(req.params.class_id);

	const chosenClass = await prisma.teacherClass.findFirst({
		where: {
			teacher_Id: parseInt(req.teacher.id),
			class_Id: classId,
		},
		select: {
			id: true,
			class_Id: true,
		}
	});

	return chosenClass;
};

/**
 * Async middleware to find all classes from a user in database.
 * 
 * @param req Request from the frontend
 * 
 * @returns {Promise} All classes
 */
export const getAllClassesMiddleware = async req => {
	let teacherClasses;

	if (req.teacher) {
		teacherClasses = await prisma.teacherClass.findMany({
			where: {
				teacher_Id: parseInt(req.teacher.id),
			},
			select: {
				class_Id: true
			}
		});
	} else {
		teacherClasses = await prisma.teacherClass.findMany({
			where: {
				teacher_Id: Number(req.id),
			},
			select: {
				class_Id: true
			}
		});
	}

	const classIds = teacherClasses.map(element => {
		return element.class_Id;
	});

	const classes = await prisma.class.findMany({
		where: {
			id: { in: classIds }
		},
		select: {
			id: true,
			classname: true,
		}
	});

	const allClasses = classes.map(element => {
		const _id = Number(element.id);
		return ({
			...element,
			id: _id,
		});
	});

	return allClasses;
};

/**
 * Async middleware to find all students from a chosen class in database.
 * 
 * @param {object} chosenClass An object with class id and it's id in teacherClass table.
 * 
 * @returns {Promise} All students
 */
export const getAllStudentsMiddleware = async chosenClass => {
	const classStudents = await prisma.classStudent.findMany({
		where: {
			class_Id: chosenClass.class_Id,
		},
		select: {
			student_Id: true
		}
	});

	const studentIds = classStudents.map(element => {
		return element.student_Id;
	});

	const students = await prisma.student.findMany({
		where: {
			id: { in: studentIds }
		},
		select: {
			id: true,
			firstname: true,
			lastname: true,
		}
	});

	const allStudents = students.map(element => {
		const _id = Number(element.id);
		return ({
			...element,
			id: _id,
		});
	});

	console.log(allStudents);

	return allStudents;
};

/**
 * Async middleware to find a chosen student in database.
 * 
 * @param req Request from the frontend
 * 
 * @returns {Promise} Chosen student
 */
export const chosenStudentMiddleware = async req => {
	const studentId = parseInt(req.params.student_id);

	const chosenClass = await chosenClassMiddleware(req);

	const chosenStudent = await prisma.classStudent.findFirst({
		where: {
			class_Id: chosenClass.class_Id,
			student_Id: studentId,
		},
		select: {
			id: true,
			student_Id: true,
		}
	});

	return chosenStudent;
};

/**
 * Async middleware to find all session from a chosen class in database.
 * 
 * @param {object} chosenClass An object with class id and it's id in teacherClass table.
 * 
 * @returns {Promise} All sessions
 */
export const getAllSessionsMiddleware = async chosenClass => {
	const classSession = await prisma.classSession.findMany({
		where: {
			class_Id: chosenClass.class_Id,
		},
		select: {
			session_Id: true,
		},
	});

	const sessionIds = classSession.map(element => {
		return element.session_Id;
	});

	const sessions = await prisma.session.findMany({
		where: {
			id: { in: sessionIds },
		},
		select: {
			id: true,
			date: true,
			situation: true,
		},
	});

	const allSessions = sessions.map(element => {
		const _id = Number(element.id);
		const _situation = JSON.parse(element.situation);
		return ({
			...element,
			id: _id,
			situation: _situation,
		});
	});

	console.log(allSessions);

	return allSessions;
};

/**
 * Async middleware to find a chosen session in database.
 * 
 * @param req Request from the frontend
 * 
 * @returns {Promise} Chosen session
 */
export const chosenSessionMiddleware = async req => {
	const sessionId = parseInt(req.params.session_id);

	const chosenClass = await chosenClassMiddleware(req);

	const chosenSession = await prisma.classSession.findFirst({
		where: {
			class_Id: chosenClass.class_Id,
			session_Id: sessionId,
		},
		select: {
			id: true,
			session_Id: true,
		},
	});

	return chosenSession;
};