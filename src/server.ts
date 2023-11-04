import express from 'express';import cors from 'cors';
import morgan from 'morgan';

import router from './router';
import { protect } from './modules/auth';
import { createNewUser, signin } from './handlers/user';

const app = express();

app.use(cors({
	credentials: true,
	origin: process.env.ORIGIN
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200);
    res.json({ message: 'hello' });
});

app.use('/api', protect, router);

app.post('/new-user', createNewUser);
app.post('/login', signin);

app.use((err, req, res, next) => {
    if (err.type === 'auth') {
        res.status(401).json({ message: 'unauthorized' });
    } else if (err.type === 'input') {
        res.status(400).json({ message: 'invalid input' });
    } else {
        res.status(500).json({ message: 'server error' });
    }
});

export default app;