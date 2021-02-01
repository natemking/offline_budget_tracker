//*** Dependencies ***//
//====================//
const router = require('express').Router();

//*** Models connection ***//
//=========================//
const db = require('../models');

//*** API Routes ***//
//==================//
//Single transactions
router.route('/api/transaction/:id?')
  .get((req, res) => {
    db.Transaction.find({}).sort({ date: -1 })
      .then(dbTransaction => {
        res.json(dbTransaction);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  })
  .post(({ body }, res) => {
    db.Transaction.create(body)
      .then(dbTransaction => {
        res.json(dbTransaction);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  })
  .put(({ body, params }, res) => {
    db.Transaction.findByIdAndUpdate(`${params.id}`, body ).then(dbTransaction => {
        res.json(dbTransaction);
      }).catch(err => {
        res.status(404).json(err);
      });
  })
  .delete(({ params },res) => {
    db.Transaction.findByIdAndDelete(`${ params.id }`)
      .then(dbTransaction => {
        res.json(dbTransaction);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

//Bulk transactions
router.post('/api/transaction/bulk', ({body}, res) => {
  db.Transaction.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;