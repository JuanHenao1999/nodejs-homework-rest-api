const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const connection = require("./db/connection.js");
require("dotenv").config();

const contactsRouter = require("./api/contactsView.js");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));
app.use(cors());

require("./config/config-passport.js");
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));

app.use("/api", contactsRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: `Use api on routes: 
    /api/signup - registration user {username, email, password}
    /api/login - login {email, password}
    /api/list - get message if user is authenticated`,
    data: "Not found",
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal server error",
  });
});

const PORT = process.env.PORT || 4000;

connection
  .then(() =>
    app.listen(PORT, () => {
      console.log(
        `Database connection successful. Server running. Use our API on port : ${PORT}`
      );
    })
  )
  .catch((error) => {
    console.log(`Server not running. 
Eror message: ${error.message}`);
    process.exit(1);
  });

module.exports = app;
