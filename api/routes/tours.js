const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const multer = require('multer');

const Tour = require('../models/tour');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/images/');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
  fileFilter,
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Tour.findById(id, (err, doc) => {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});

router.get('/', (req, res, next) => {
  // http://localhost:5000/tours?skip=2&limit=5&order=asc
  const skip = parseInt(req.query.skip, 10);
  const limit = parseInt(req.query.limit, 10);
  const { order } = req.query;
  // order = asc[ending] || desc[ending]
  Tour.find()
    .skip(skip)
    .sort({ _id: order })
    .limit(limit)
    .exec((err, doc) => {
      if (err) return res.json({ success: false });
      res.status(200).send(doc);
    });
});

router.post('/', upload.single('tourImage'), (req, res, next) => {
  console.log(req.file);
  console.log('req.body: ', req.body);
  const tour = new Tour({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    tourImage: req.file.path,
  });
  tour.save((err, doc) => {
    if (err) return res.json({ success: false });
    res.status(200).json({
      tourId: doc._id,
      post: true,
    });
  });
});

router.post('/:id', (req, res, next) => {
  console.log('req.body: ', req.body);
  const id = req.params.id;
  Tour.findByIdAndUpdate(id, req.body, { new: true }, (err, doc) => {
    if (err) return res.status(400).send(err);
    res.json({
      success: true,
      doc,
    });
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Tour.findByIdAndRemove(id, (err) => {
    if (err) return res.json({ success: false });
    res.json(true);
  });
});

module.exports = router;
