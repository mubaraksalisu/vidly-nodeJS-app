const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(404).send("No movie with the given ID was found");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).send("No customer with the given ID was found");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  //   rental = rental.save();

  //   movie.numberInStock--;
  //   movie.save();

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

module.exports = router;
