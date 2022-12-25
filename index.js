// express srv
const express = require('express');
const app = express();

//env import
const dotenv = require('dotenv');
dotenv.config();

//user routes
const userRoute = require('./routes/user');
//user routes
const authRoute = require('./routes/auth');

// using library for mongoDB
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('db connection established'))
  .catch((err) => console.log(err));

// to accept POST JSON format
app.use(express.json());
//using routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log('running on 5000');
});