const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      trim: true,
    },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, required: true, min: 0, max: 200 },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 200 },
  })
);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(255),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().default(0).max(200),
    dailyRentalRate: Joi.number().default(0).max(200),
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
