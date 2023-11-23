// Sample authentication utility functions
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to check if a user is authenticated
const isAuthenticated = (req) => {
    return req.user !== undefined; // Replace with your actual check
  };
  
// Function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};


  // Function to compare password
  async function comparePasswords(plainTextPassword, hashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
  
// Function to generate a JSON Web Token (JWT)
const generateToken = (user) => {
  // Define your secret key (it should be kept secret and not hard-coded)
  const secretKey = process.env.secretKey;
  const payload = {
    user,
  };

  // Generate the token with user data and the secret key
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Adjust the expiration as needed
  return token;
 
};



  
  module.exports = {
    isAuthenticated,
    comparePasswords,
    generateToken,
    hashPassword
  };
  