const mongoose = require('mongoose');
const { 
  handleError,
  handleCastError,
  handleValidationError,
  handleDuplicateFieldError
} = require('../utils/errorHandler');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error for debugging
  console.error('ERROR 💥', err);
  
  // Mongoose bad ObjectId (Cast Error)
  if (err instanceof mongoose.Error.CastError) {
    error = handleCastError(err);
  }
  
  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    error = handleValidationError(err);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    error = handleDuplicateFieldError(err);
  }
  
  // Invalid JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON: ' + err.message
    });
  }
  
  // Handling operational errors (custom AppError instances)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  
  // For all other errors, use the generic handler
  handleError(error, res);
};

/**
 * Catch 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Middleware to handle async errors without try/catch
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Middleware function with error handling
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
}; 