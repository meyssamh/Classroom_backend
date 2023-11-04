"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionValidator = exports.studentValidator = exports.classValidator = void 0;
var express_validator_1 = require("express-validator");
exports.classValidator = [
    (0, express_validator_1.body)('classname').exists().isString(),
];
exports.studentValidator = [
    (0, express_validator_1.body)('firstname').exists().isString(),
    (0, express_validator_1.body)('lastname').exists().isString(),
];
exports.sessionValidator = [
    (0, express_validator_1.body)('situation').exists().isString(),
];
