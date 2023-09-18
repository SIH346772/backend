const router = require("express").Router();
const prisma = require("../db").getInstance();

// POST /:id/pump
// Add a new pump to a base station

// GET /:id/pump
// Get all pumps for a base station

// GET /:id/pump/:pump_id
// Get a pump by id
// Query params: from, to

module.exports = router