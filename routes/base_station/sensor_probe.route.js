const router = require("express").Router();
const prisma = require("../../db").getInstance();

// POST /:id/sensor_probe
// Add a new sensor probe to a base station

// GET /:id/sensor_probe
// Get all sensor probes for a base station

// GET /:id/sensor_probe/:id
// Get a sensor probe by id

// GET /:id/sensor_probe/:id/weather_data
// Get weather data for a sensor probe
// Query params: from, to

// GET /:id/sensor_probe/:id/soil_data
// Get soil data for a sensor probe

module.exports = router