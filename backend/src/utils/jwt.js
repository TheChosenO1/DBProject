//generates tokens so that actions are traceable and secure and avoid any risk of editing by hackers

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET
const EXPIRES = process.env.JWT_EXPIRES_IN || '15d';

exports.sign = (payload) => jwt.sign(payload, SECRET, {expiresIn: EXPIRES}); //the token generated upon login/signup
exports.verify = (token) => jwt.verify(token, SECRET); //possibly used to verify important actions that the user may make