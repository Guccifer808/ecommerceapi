const router = require('express').Router();
const { response } = require('express');
//user model import
const User = require('../models/User');

//Register

router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    //saving user to db using async function
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); //201 - successfuly added
  } catch (err) {
    response.status(500).json(err);
  }
});

module.exports = router;
