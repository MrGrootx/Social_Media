const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    return mongoose
      .connect(process.env.DATABASE)
      .then(() => {
        console.log("Database connected");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = new Database();
