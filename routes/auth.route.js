const router = require("express").Router();
const prisma = require("../db").getInstance();

const JWT = require("../utils/jwt");


// POST /auth/otp
// POST /auth/login
// POST /auth/register

module.exports = router