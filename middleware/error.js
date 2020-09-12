const winston = require("winston");

module.exports = function (err, req, res, next) {
  // Log the exceptions
  winston.error(err.message, err);

  res.status(500).send("Something failed on server");
};
