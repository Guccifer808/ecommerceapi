const User = require('../models/User');
const { verifyToken, verifyTokenAndAuth } = require('./verifyToken');

const router = require('express').Router();

//Check and Update
router.put('/:id', verifyTokenAndAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET_KEY
    ).toString();
  }
  //updating, setting new whole body
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } //return updated user
    );
    //if success
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
