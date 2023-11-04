import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = password => {
    return bcrypt.hash(password, 8);
};

export const createJWT = user => {
    const token = jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );

    return token;
};

export const protect = (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401);
        res.json({ message: 'Not Authorizad' });
        return;
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        res.status(401);
        res.json({ message: 'Not Authorizad' });
        return;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        if (Date.now() >= user.exp * 1000) {
            throw new Error();
        } else {
            req.teacher = user;
            next();
        }

    } catch (e) {
        res.status(401);
        res.json({ message: 'Not Valid Token' });
        return;
    }
};