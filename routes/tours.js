const { Tour } = require('../models/tour');

module.exports = (app) => {
  app.get('/api/gettour', (req, res) => {
    const id = req.query.id;
    Tour.findById(id, (err, doc) => {
      if (err) return res.status(400).send(err);
      res.send(doc);
    });
  });

  app.get('/api/tours', (req, res) => {
    // http://localhost:5000/api/tours?limit=5&order=asc
    const limit = parseInt(req.query.limit, 10);
    const { order } = req.query;
    // order = asc[ending] || desc[ending]
    Tour.find()
      .sort({ _id: order })
      .limit(limit)
      .exec((err, doc) => {
        if (err) return res.json({ success: false });
        res.status(200).send(doc);
      });
  });

  app.post('/api/tour', (req, res) => {
    const tour = new Tour(req.body);
    tour.save((err, doc) => {
      if (err) return res.json({ success: false });
      res.status(200).json({
        tourId: doc._id,
        post: true,
      });
    });
  });

  app.post('/api/tour_update', (req, res) => {
    Tour.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, doc) => {
      if (err) return res.status(400).send(err);
      res.json({
        success: true,
        doc,
      });
    });
  });

  app.delete('/api/tour_delete', (req, res) => {
    const { id } = req.query;
    Tour.findByIdAndRemove(id, (err) => {
      if (err) return res.json({ success: false });
      res.json(true);
    });
  });
};
