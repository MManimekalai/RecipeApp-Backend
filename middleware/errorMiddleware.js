// errorMiddleware.js

// Error middleware function
const errorMiddleware = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err.stack);
  
    // Check if the error is a Joi validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.details });
    }
  
    // Handle other types of errors as needed
    res.status(500).json({ message: 'Internal server error', error: err.message });
  };
  
  module.exports = errorMiddleware;
  