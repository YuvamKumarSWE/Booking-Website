const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Parse the JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Middleware to parse JSON data from the request body
app.use(express.json());

// Route handler functions
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
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

app.route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);


  app.route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
  
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