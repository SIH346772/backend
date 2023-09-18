const router = require("express").Router();

router.use("/data", require("./data.route"))

module.exports = router