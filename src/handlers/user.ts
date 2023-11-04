import prisma from '../db';
import { comparePassword, createJWT, hashPassword } from '../modules/auth';
import { findEmail, findUser } from '../modules/middleware';

// Create new user
export const createNewUser = async (req, res) => {
	const nameRegex = /^[a-zA-Z]+$/;
	const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const firstname = req.body.firstname.trim();
	const lastname = req.body.lastname.trim();
	const email = req.body.email.trim();
	const username = req.body.username.trim();
	const password = req.body.password.trim();
	const confirmPassword = req.body.confirmPassword.trim();

	if (firstname.length > 0 && !firstname.match(nameRegex)) {
		return res.status(401).json({ message: 'Invalid input!' });
	} else if (lastname.trim().length > 0 && !lastname.match(nameRegex)) {
		return res.status(401).json({ message: 'Invalid input!' });
	} else if (!email.match(emailRegex) ||
		email.length === 0 ||
		username.length < 4 ||
		password.length < 8 ||
		password !== confirmPassword
	) {
		return res.status(401).json({ message: 'Invalid input!' });
	}

	const createdUsers = await findUser(req);

	if (createdUsers) {
		return res.status(400).json({ message: 'Username is taken!' });
	}

	const emailExists = await findEmail(req);

	if (emailExists) {
		return res.status(400).json({ message: 'E-mail already exists!' });
	}
	
	const hashedPassword = await hashPassword(req.body.password);

	const user = await prisma.teacher.create({
		data: {
			username: username,
			email: email,
			password: hashedPassword
		}
	});

	const serialized = { ...user, id: user.id.toString() };

	const token = createJWT(serialized);

	const name = {
		username: req.body.username ? req.body.username : '',
		firsname: req.body.firstname ? req.body.firstname : '',
		lastname: req.body.lastname ? req.body.lastname : ''
	};

	res.status(200).cookie(
		'access_token',
		'Bearer ' + token,
		{
			expires: new Date(Date.now() + process.env.COOKIE_MAX_AGE),
			httpOnly: true,
			secure: true,
			maxAge: process.env.COOKIE_MAX_AGE,
		}
	).json({ data: name });

};

// Sign in
export const signin = async (req, res) => {
	const username = req.body.username.trim();
	const password = req.body.password.trim();

	if (username.length < 4 || password.length < 8) {
		return res.status(401).json({ message: 'Invalid input!' });
	}

	const user = await findUser(req);

	if (!user) {
		return res.status(401).json({ message: 'Wrong Username or Password!' });
	}

	const isValid = await comparePassword(password, user.password);

	if (!isValid) {
		return res.status(401).json({ message: 'Wrong Username or Password!' });
	}

	const serialized = { ...user, id: user.id.toString() };

	const token = createJWT(serialized);

	const name = {
		username: user.username,
		firstname: user.firstname ? user.firstname : '',
		lastname: user.lastname ? user.lastname : ''
	};

	console.log(token);

	res.status(200).cookie(
		'access_token',
		'Bearer ' + token,
		{
			expires: new Date(Date.now() + process.env.COOKIE_MAX_AGE),
			// httpOnly: true,
			secure: true,
			maxAge: process.env.COOKIE_MAX_AGE,
		}
	).json({
		data: { user: name }
	});
};