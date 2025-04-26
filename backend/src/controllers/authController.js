//Used to control login and sign up

require('dotenv').config();
const pool   = require('../db/pool');
const { hash, verify } = require('../utils/hash');
const { sign }         = require('../utils/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body; //the params
  if (!email || !password)
    return res.status(400).json({ message: 'Email & Password Required' }); //Bad Request since empty params

  try {
    // check existing
    const { rowCount } = await pool.query(
      'SELECT 1 FROM public.users WHERE email = $1',
      [email]
    );
    if (rowCount)
      return res.status(400).json({ message: 'User already exists' }); //Bad Request since user exists

    const passHash = await hash(password);
    
    //insert the details and the passHash
    const { rows } = await pool.query(
      `INSERT INTO public.users (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING userid, first_name, last_name, email`,
      [firstName, lastName, email, passHash]
    );

    const user  = rows[0];
    const token = sign({ id: user.userid, email: user.email }); //generate Token
    res.status(201).json({ token, user }); //successful respnse
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message }); //error
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email & Password Required' }); //Bad Request since empty params

  try {
    const { rows } = await pool.query(
      'SELECT userid, first_name, last_name, password FROM public.users WHERE email = $1',
      [email]
    );
    if (!rows.length)
      return res.status(401).json({ message: 'Invalid Credentials' }); //Unauthorized since no user found

    const user = rows[0];
    const ok   = await verify(password, user.password);
    if (!ok)
      return res.status(401).json({ message: 'Invalid Credentials' }); //Unauthorized since no user found

    const token = sign({ id: user.userid, email }); //generate Token
    delete user.password; //delete the password before sending to front end
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message }); //error
  }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT userid, first_name, last_name, email FROM public.users WHERE userid = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({ user });
    } catch (error) {
        logger.error(`Get Current User Error: ${error.message}`);
        res.status(500).json({ error: 'Error fetching user information' });
    }
};

module.exports = {
    signup,
    login,
    getCurrentUser
};
