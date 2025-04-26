//the hash function

const bcrypt = require('bcrypt');
const ROUNDS = 10; //number of rounds of salting and hashin

exports.hash = (plain) => bcrypt.hash(plain, ROUNDS); //used to hash plain passwords
exports.verify = (plain, hash) => bcrypt.compare(plain, hash); //used to verify if passwords match
