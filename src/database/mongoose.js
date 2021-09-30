const mongoose = require("mongoose");
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbname = process.env.DB_NAME;

const url = `mongodb://${host}:${port}/${dbname}`;
const rules = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(url, rules, function (err) {
  if (err) {
    console.log(
      "\n\tDatabase connection failed! Please start the mongodb server."
    );
    console.log("--------------------------------------------------");
    process.exit(1);
  } else {
    console.log(
      "\n\t",
      mongoose.connection.readyState,
      "DB Connection Successfully"
    );
    console.log("--------------------------------------------------");
  }
});
