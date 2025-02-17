const express = require('express');
const fs = require('fs');
const morgan = require('morgan'); // Third-party middleware for logging requests

const app = express();
const port = 3000;

// Parse the JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


app.use(morgan('dev'));

// Middleware to parse JSON data from the request body
// This middleware should be placed before the route handlers
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route handler functions
const getAllTours = (req, res) => {
  console.log(req.requestTime); // FROM MIDDLEWARE FUNCTION ABOVE 
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours }
  });
};
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
      res.status(201).json({
        status: 'success',
        data: { tour: newTour }
      });
    }
  );
};
const getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour }
  });
};
const updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tourIndex = tours.findIndex(el => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }

  tours[tourIndex] = { ...tours[tourIndex], ...req.body };

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
      res.status(200).json({
        status: 'success',
        data: { tour: tours[tourIndex] }
      });
    }
  );
};
const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tourIndex = tours.findIndex(el => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }

  tours.splice(tourIndex, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
      res.status(204).json({
        status: 'success',
        data: null
      });
    }
  );
};
const getAllUsers = (req, res) => { 
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
const getUser = (req, res) =>    {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};



// Routes

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter.route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.use('/api/v1/tours', tourRouter); // Mount the tour router
app.use('/api/v1/users', userRouter); // Mount the user router

// Routes
//app.get('/api/v1/tours', getAllTours);
//app.post('/api/v1/tours', createTour);
//app.get('/api/v1/tours/:id', getTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

// Start the server


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});