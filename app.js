require("dotenv").config();
require("./src/database/mongoose");
const express = require("express");
const fs = require("fs");
const { errors, statusCodes } = require("./src/utls/constants");
const router = express.Router();

const port = process.env.PORT || 4001;
const host = process.env.HOST || "localhost";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

fs.readdirSync(__dirname + "/src/routes").forEach(function (file) {
  const name = file.substr(0, file.indexOf("."));
  const route = require(`./src/routes/${name}.route.js`)(router, app);
  app.use(`/api/${name}`, route);
});

app.use((err, req, res, next) => {
  res.status(err.status || statusCodes.internalServerError);
  return res.json({
    error: {
      status: err.status || statusCodes.internalServerError,
      message: err.message || errors.somethingSeemsWrong,
    },
  });
});
app.listen(port, host, (err) => {
  if (err) {
    console.log("\n--------------------------------------------------");
    console.log("\tserver not started due to : ", err);
    process.exit(1);
  }
  console.log("\n--------------------------------------------------");
  console.log("\tServer is listening on port *" + port);
});
