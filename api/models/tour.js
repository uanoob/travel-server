const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, default: 'n/a' },
    image: {
      key: { type: String, required: true },
      path: { type: String, required: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Tour', tourSchema);
