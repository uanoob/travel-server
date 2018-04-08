const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    hotel: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: 'n/a',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    price: {
      type: String,
      default: 'n/a',
    },
    reviews: {
      type: String,
      default: 'n/a',
    },
  },
  { timestamps: true },
);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = { Tour };
