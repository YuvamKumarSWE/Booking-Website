const express = require('express');
const { getAllTours, createTour, getTour } = require('../controllers/tourController');
const { updateTour, deleteTour, checkID } = require('../controllers/tourController');
//const tourController = require('../controllers/tourController');
//then use tourController.getAllTours, etc.

const router = express.Router();

router.param('id', checkID);

//checkbody middleware to see if it body contains the name and price property
//if not send back 400 (bad request)
//add it to the post handler stack
const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

router.route('/')
  .get(getAllTours)
  .post(checkBody,  createTour);

router.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;