import prisma from '../db';
import {
	chosenClassMiddleware,
	chosenStudentMiddleware,
	getAllStudentsMiddleware
} from '../modules/middleware';

// Get all students
export const getAllStudents = async (req, res) => {
	const chosenClass = await chosenClassMiddleware(req);

	const allStudents = await getAllStudentsMiddleware(chosenClass);

	res.json({ data: { students: allStudents } });
};

// Get one student
export const getOneStudent = async (req, res) => {
	const chosenStudent = await chosenStudentMiddleware(req);

	if (chosenStudent === null) {
		return res.status(400).json({ message: 'Something went wrong!' });
	}

	const studentInformation = await prisma.student.findFirst({
		where: {
			id: chosenStudent.student_Id,
		},
		select: {
			firstname: true,
			lastname: true,
		},
	});

	res.json({ data: { student: studentInformation } });
};

// Create student
export const createStudent = async (req, res) => {
	const nameRegex = /^[a-zA-Z]+$/;

	const firstname = req.body.firstname.trim();
	const lastname = req.body.lastname.trim();

	if (firstname.length === 0 || !firstname.match(nameRegex)) {
		return res.status(401).json({ message: 'Invalid input!' });
	} else if (lastname.length === 0 || !lastname.match(nameRegex)) {
		return res.status(401).json({ message: 'Invalid input!' });
	}

	const classId = parseInt(req.params.class_id);

	const chosenClass = await prisma.teacherClass.findFirst({
		where: {
			teacher_Id: parseInt(req.teacher.id),
			class_Id: classId,
		},
		select: {
			class_Id: true,
		}
	});

	const newStudent = await prisma.student.create({
		data: {
			firstname: firstname,
			lastname: lastname,
		},
		select: {
			id: true,
			firstname: true,
			lastname: true,
		}
	});

	await prisma.classStudent.create({
		data: {
			class_Id: chosenClass.class_Id,
			student_Id: newStudent.id,
		},
	});

	const newStudentId = Number(newStudent.id);

	await prisma.historyLog.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			activity: `created student with id ${newStudentId}`,
		},
	});

	const handeledNewStudent = {
		...newStudent,
		id: newStudentId,
	};

	res.json({ data: { newStudent: handeledNewStudent } });
};

// Update student
export const updateStudent = async (req, res) => {
	const nameRegex = /^[a-zA-Z]+$/;

	const firstname = req.body.firstname.trim();
	const lastname = req.body.lastname.trim();

	if (firstname.length === 0 || !firstname.match(nameRegex)) {
		return res.status(401).json({ message: 'Invalid input!' });
	} else if (lastname.length === 0 || !lastname.match(nameRegex)) {
		return res.status(401).json({ message: 'Invalid input!' });
	}
	
	const chosenStudent = await chosenStudentMiddleware(req);

	if (chosenStudent === null) {
		return res.status(400).json({ message: 'Something went wrong!' });
	}

	const updatedStudent = await prisma.student.update({
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
	});

	const updatedStudentId = Number(updatedStudent.id);

	await prisma.historyLog.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			activity: `updated an existing student with id ${updatedStudentId}`,
		},
	});

	const handeledUpdatedStudent = {
		...updatedStudent,
		id: updatedStudentId,
	};

	res.json({ data: { updatedStudent: handeledUpdatedStudent } });
};

// Delete student
export const deleteStudent = async (req, res) => {
	const chosenStudent = await chosenStudentMiddleware(req);

	if (chosenStudent === null) {
		return res.status(400).json({ message: 'Something went wrong!' });
	}

	await prisma.classStudent.delete({
		where: {
			id: chosenStudent.id
		}
	});

	const deletedStudent = await prisma.student.delete({
		where: {
			id: chosenStudent.student_Id,
		},
		select: {
			id: true,
			firstname: true,
			lastname: true,
		}
	});

	const deletedStudentId = Number(deletedStudent.id);

	await prisma.historyLog.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			activity: `deleted an existing student with id ${deletedStudentId}`,
		},
	});

	const handeledDeletedStudent = {
		...deletedStudent,
		id: deletedStudentId,
	};

	res.json({ data: { deletedStudent: handeledDeletedStudent } });
};