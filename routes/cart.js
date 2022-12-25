const Cart = require('../models/Cart');
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();

//Create
router.post('/', verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Check and Update Cart
router.put('/:id', verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } //return updatedCart
    );
    //if success
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete user Cart
router.delete('/:id', verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json('Cart has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get user Cart
router.get('/find/:userId', verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
