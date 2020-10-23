const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  //  get the token after "Bearer "
    jwt.verify(token, 'secret_in_prod_this_is_longer_and_random');
    next(); // required in order to continue down the middleware chain
  } catch (error) {
    res.status(401).json({ message: "Auth failed. No valid token received."})
  }
}