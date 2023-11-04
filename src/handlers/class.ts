import prisma from '../db';
import {
	getAllClassesMiddleware,
	chosenClassMiddleware,
	getAllStudentsMiddleware,
	getAllSessionsMiddleware
} from '../modules/middleware';

// Get all classes
export const getAllClasses = async (req, res) => {

	const allClasses = await getAllClassesMiddleware(req);

	res.status(200).json({ data: { classes: allClasses } });
};

// Get one class
export const getOneClass = async (req, res) => {
	const chosenClass = await chosenClassMiddleware(req);

	if (chosenClass === null) {
		return res.status(400).json({ message: 'Something went wrong!' });
	}

	const classInformation = await prisma.class.findUnique({
		where: {
			id: chosenClass.class_Id
		},
		select: {
			id: true,
			classname: true,
		}
	});

	const selectedClass = { ...classInformation, id: Number(classInformation.id) };

	const allStudents = await getAllStudentsMiddleware(chosenClass);

	const allSessions = await getAllSessionsMiddleware(chosenClass);

	res.status(200).json({
		data: {
			class: selectedClass,
			students: allStudents,
			sessions: allSessions
		}
	});
};

// Create class
export const createClass = async (req, res) => {
	const classname = req.body.classname.trim();

	if (classname.length === 0) {
		return res.status(401).json({ message: 'Invalid input!' });
	}

	const newClass = await prisma.class.create({
		data: {
			classname: classname,
		},
		select: {
			id: true,
			classname: true,
		}
	});

	await prisma.teacherClass.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			class_Id: newClass.id
		},
	});

	const newClassId = Number(newClass.id);

	await prisma.historyLog.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			activity: `added a new class with id ${newClassId}`,
		}
	});

	const handeledNewClass = {
		...newClass,
		id: newClassId,
	};

	res.status(200).json({ data: { newClass: handeledNewClass } });
};

// Update class
export const updateClass = async (req, res) => {
	const classname = req.body.classname.trim();

	if (classname.length === 0) {
		return res.status(401).json({ message: 'Invalid input!' });
	}

	const chosenClass = await chosenClassMiddleware(req);

	if (chosenClass === null) {
		return res.status(400).json({ message: 'Something went wrong!' });
	}

	const updatedClass = await prisma.class.update({
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
	});

	const updatedClassId = Number(updatedClass.id);

	await prisma.historyLog.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			activity: `updated an existing class with id ${updatedClassId}`,
		}
	});

	const handeledUpdatedClass = {
		...updatedClass,
		id: updatedClassId,
	};

	res.status(200).json({ data: { updatedClass: handeledUpdatedClass } });
};

// Delete class
export const deleteClass = async (req, res) => {
	const chosenClass = await chosenClassMiddleware(req);

	if (chosenClass === null) {
		return res.status(400).json({ message: 'Something went wrong!' });
	}

	await prisma.teacherClass.delete({
		where: {
			id: chosenClass.id
		}
	});

	const chosenStudents = await prisma.classStudent.findMany({
		where: {
			class_Id: chosenClass.class_Id,
		},
		select: {
			student_Id: true,
		}
	});

	const chosenStudentsIds = chosenStudents.map(classStudents => {
		return classStudents.student_Id;
	});

	await prisma.classStudent.deleteMany({
		where: {
			class_Id: chosenClass.id
		}
	});

	await prisma.student.deleteMany({
		where: {
			id: {
				in: chosenStudentsIds
			},
		}
	});

	const chosenSessions = await prisma.classSession.findMany({
		where: {
			class_Id: chosenClass.class_Id,
		},
		select: {
			session_Id: true,
		},
	});

	const chosenSessionsIds = chosenSessions.map(classSessions => {
		return classSessions.session_Id;
	});

	await prisma.classSession.deleteMany({
		where: {
			class_Id: chosenClass.id
		},
	});

	await prisma.session.deleteMany({
		where: {
			id: {
				in: chosenSessionsIds
			}
		}
	});

	const deletedClass = await prisma.class.delete({
		where: {
			id: chosenClass.class_Id,
		},
		select: {
			id: true,
			classname: true,
		}
	});

	const deletedClassId = Number(deletedClass.id);

	await prisma.historyLog.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			activity: `deleted an existing class with id ${deletedClassId}`,
		}
	});

	const handeledDeletedClass = {
		...deletedClass,
		id: deletedClassId,
	};

	res.status(200).json({ data: { deletedClass: handeledDeletedClass } });
};