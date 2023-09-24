require("dotenv").config();

const PORT = parseInt(process.env.PORT);
const DEBUG = parseInt(process.env.DEBUG);

// Setup
const express = require("express");
const cors = require("cors");
const app = express();

var admin = require("firebase-admin");

const { applicationDefault } = require("firebase-admin/app");

admin.initializeApp({
  credential: applicationDefault(),
  projectId:"agrio"

})


// Config
global.__basedir = __dirname;
app.disable("x-powered-by");
app.use(express.json());
app.use(cors());
app.options("*", cors());

// Set logger
if (DEBUG == 1) {
  var morgan = require("morgan");
  app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
}

// Middleware
app.use(require("./middleware").AuthMiddleware.resolveUser);
// TODO : add authorization middleware

// REST API
app.use("/auth", require("./routes/auth.route"));
app.use("/tree", require("./routes/tree.route"));
app.use("/account", require("./middleware").AuthMiddleware.authRequired, require("./routes/account.route"));
app.use("/base_station", require("./middleware").AuthMiddleware.authRequired, require("./routes/base_station/index"));
// TODO: add middleware to check if request is from authenticated source
app.use("/external", require("./routes/external_service/index.route"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected Error" });
  next(err);
});

// Listen
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
