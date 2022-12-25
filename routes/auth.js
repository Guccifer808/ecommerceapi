const router = require('express').Router();
const { response } = require('express');
//user model import
const User = require('../models/User');
//CryptoJS for passwords
const CryptoJS = require('crypto-js');
//JWT
const jwt = require('jsonwebtoken');
//Register

router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET_KEY
    ).toString(),
  });

  try {
    //saving user to db using async function
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); //201 - successfuly added
  } catch (err) {
    response.status(500).json(err);
  }
});

//Login

router.post('/login', async (req, res) => {
  try {
    //looking for username
    const user = await User.findOne({ username: req.body.username });
    //condition check
    !user && res.status(401).json('Wrong username!');
    // decrypt password
    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET_KEY
    );
    //turn into string
    const rawPassword = hashPassword.toString(CryptoJS.enc.Utf8);
    //condition check
    rawPassword !== req.body.password &&
      res.status(401).json('Wrong password!');
    //JWT
    const accessToken = jwt.sign(
      {
        Id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' } //token expires in 7days
    );
    // protecting password hash
    const { password, ...other } = user._doc;
    // if success
    res.status(200).json({ ...other, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
