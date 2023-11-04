import prisma from '../db';
import {
	chosenClassMiddleware,
	chosenSessionMiddleware,
	getAllSessionsMiddleware
} from '../modules/middleware';

// Get all sessions
export const getAllSessions = async (req, res) => {
	const chosenClass = await chosenClassMiddleware(req);

	const allSessions = await getAllSessionsMiddleware(chosenClass);

	res.status(200).json({ data: { sessions: allSessions } });
};

// Get one session
export const getOneSession = async (req, res) => {
	const chosenSession = await chosenSessionMiddleware(req);

	if (chosenSession === null) {
		return res.status(400).json({ message: 'Something went wrong!' });
	}

	const session = await prisma.session.findFirst({
		where: {
			id: chosenSession.session_Id,
		},
		select: {
			date: true,
			situation: true,
		}
	});

	res.status(200).json({ data: session });
};

// Create session
export const createSession = async (req, res) => {
	const classId = parseInt(req.params.class_id);

	const chosenClass = await prisma.teacherClass.findFirst({
		where: {
			teacher_Id: parseInt(req.teacher.id),
			class_Id: classId,
		},
		select: {
			class_Id: true,
		},
	});

	const newSession = await prisma.session.create({
		data: {
			situation: req.body.situation,
		},
		select: {
			id: true,
			date: true,
			situation: true,
		}
	});

	await prisma.classSession.create({
		data: {
			class_Id: chosenClass.class_Id,
			session_Id: newSession.id,
		},
	});

	const newSessionId = Number(newSession.id);
	const newSessionSituation = JSON.parse(newSession.situation);

	await prisma.historyLog.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			activity: `created session with id ${newSessionId}`,
		},
	});

	const handeledNewSession = {
		...newSession,
		id: newSessionId,
		situation: newSessionSituation,
	};

	res.status(200).json({ data: { newSession: handeledNewSession } });
};

// Update session
export const updateSession = async (req, res) => {
	const chosenSession = await chosenSessionMiddleware(req);

	if (chosenSession === null) {
		return res.status(400).json({ message: 'Something went wrong!' });
	}

	const updatedSession = await prisma.session.update({
		where: {
			id: chosenSession.session_Id,
		},
		data: {
			situation: req.body.situation,
		},
		select: {
			id: true,
			date: true,
			situation: true,
		},
	});

	const updatedSessionId = Number(updatedSession.id);
	const updatedSessionSituation = JSON.parse(updatedSession.situation);

	await prisma.historyLog.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			activity: `updated an existing session with id ${updatedSessionId}`,
		},
	});

	const handeledupdatedSession = {
		...updatedSession,
		id: updatedSessionId,
		situation: updatedSessionSituation,
	};

	res.status(200).json({ data: { updatedSession: handeledupdatedSession } });
};

// Delete session
export const deleteSession = async (req, res) => {
	const chosenSession = await chosenSessionMiddleware(req);

	if (chosenSession === null) {
		return res.status(400).json({ message: 'Something went wrong!' });
	}

	await prisma.classSession.delete({
		where: {
			id: chosenSession.id
		},
	});

	const deletedSession = await prisma.session.delete({
		where: {
			id: chosenSession.session_Id
		},
		select: {
			id: true,
			date: true,
			situation: true,
		},
	});

	const deletedSessionId = Number(deletedSession.id);
	const deletedSessionSituation = JSON.parse(deletedSession.situation);

	await prisma.historyLog.create({
		data: {
			teacher_Id: parseInt(req.teacher.id),
			activity: `deleted an existing session with id ${deletedSessionId}`,
		},
	});

	const handeledDeletedSession = {
		...deletedSession,
		id: deletedSessionId,
		situation: deletedSessionSituation,
	};

	res.status(200).json({ data: { deletedSession: handeledDeletedSession } });
};