const winston = require("winston");
//require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "exceptions.log" })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  //   winston.add(
  //     new winston.transports.MongoDB({
  //       db: "mongodb://localhost/vidly-db",
  //       options: { useUnifiedTopology: true },
  //     })
  //   );
};
