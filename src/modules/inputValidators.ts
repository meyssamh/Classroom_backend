import { body } from 'express-validator';

export const classValidator = [
    body('classname').exists().isString(),
];

export const studentValidator = [
    body('firstname').exists().isString(),
    body('lastname').exists().isString(),
];

export const sessionValidator = [
    body('situation').exists().isString(),
];