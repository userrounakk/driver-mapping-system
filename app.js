if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const routes = require("./routes/routes");
const mongoose = require("mongoose");

const port = 8000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log("Listening to port ", port);
    });
  })
  .catch((error) => {
    console.log("Database connection failed");
    console.error(error);
  });
// Routes connection
app.use("/", routes);

module.exports = app;
