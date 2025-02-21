const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(app.get('env')); //development //

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  
}).then(() => {
  console.log('DB connection successful!');
}).catch((err) => {
  console.error('Error connecting to database:', err);
});






const port = 3000;
app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});