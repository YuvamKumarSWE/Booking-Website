const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {

    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj); // Convert query parameters with operators
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);
    const filters = JSON.parse(queryStr); // Convert back to object
    let query = Tour.find(filters); // Use 'let' to allow reassignment

    // SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy); // Reassign 'query' with sorted query
    } else {
      query = query.sort('-createdAt');
    }

    // FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields); // Reassign 'query' with selected fields
    } else {
      query = query.select('-__v'); // Exclude the '__v' field by default
    }

    // PAGINATION
    const page = req.query.page * 1 || 1; // Convert to number, default to 1
    const limit = req.query.limit * 1 || 100; // Convert to number, default to 100
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit); // Apply pagination

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    const tours = await query; // Execute the query after sorting, field limiting, and pagination

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: "Error fetching data!"
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: "Invalid data sent!"
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // returns the new document
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: "Invalid data sent!"
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

/*
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};
*/