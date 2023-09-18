const router = require("express").Router();
const prisma = require("../../db").getInstance();


router.use("", require("./base_station.route"))
router.use("", require("./sensor_probe.route"))
router.use("", require("./pump.route"))


module.exports = router