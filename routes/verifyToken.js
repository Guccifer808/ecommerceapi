const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; //splitting Bearer and token in header string
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json('Invalid token!');
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json('You are not authorized!');
  }
};

// Verify user id or admin function
const verifyTokenAndAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    //check if its the same user or admin
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not allowed to access this!');
    }
  });
};
module.exports = { verifyToken, verifyTokenAndAuth };
