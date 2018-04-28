const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const uuid = require('uuid/v1');

const router = express.Router();

const Tour = require('../models/tour');
const config = require('../../config');

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, './public/images/');
//   },
//   filename(req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   // reject a file
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

aws.config.update({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret_access_key,
  region: config.aws_region,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: `${config.s3_bucket}/images`,
    key(req, file, cb) {
      cb(null, `${uuid()}_${file.originalname}`);
    },
  }),
});

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 1024 * 1024 * 1,
//   },
//   fileFilter,
// });

const fileDeleteHandler = (key) => {
  const params = {
    Bucket: `${config.s3_bucket}/images`,
    Key: key,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log('file deleted! ', data); // successful response
  });
};

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

router.post('/', upload.single('file'), (req, res, next) => {
  console.log('req.body: ', req.body);
  console.log('req.file: ', req.file);
  if (req.file) {
    req.body.image = {
      key: req.file.key || 'no image',
      path: req.file.location,
    };
  }
  const tour = new Tour({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
  });
  tour.save((err, doc) => {
    if (err) return res.json({ success: false });
    res.status(200).json({
      tourId: doc._id,
      post: true,
    });
  });
});

router.post('/:id', upload.single('file'), (req, res, next) => {
  console.log('req.body: ', req.body);
  console.log('req.file: ', req.file);
  if (req.file) {
    req.body.image = {
      key: req.file.key || 'no image',
      path: req.file.location,
    };
  }
  const id = req.params.id;
  Tour.findByIdAndUpdate(id, req.body, { new: false }, (err, doc) => {
    if (err) return res.status(400).send(err);
    if (req.file) {
      fileDeleteHandler(doc.image.key);
    }
    res.json({
      success: true,
      doc,
    });
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Tour.findByIdAndRemove(id, (err, doc) => {
    if (doc) {
      fileDeleteHandler(doc.image.key);
    }
    if (err) return res.json({ success: false });
    res.json(true);
  });
});

module.exports = router;
