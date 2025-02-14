const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

const tours = JSON.parse(                     //parse the json file
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {      //route handler
  res.status(200).json({
    status: 'success',                        //status of the request
    results: tours.length,                    //number of results
    data: {                                   //data object
      tours: tours
    }
  });

});

app.use(express.json());                      //middleware to parse the data from the body
// middle b/w request and api

app.post('/api/v1/tours', (req, res) => {      // data from client to server
  console.log(req.body);                       // data in request body, for data to be available we need middleware
  
  res.send('Done');
});
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

