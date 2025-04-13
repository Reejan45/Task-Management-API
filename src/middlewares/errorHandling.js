
const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';
    let status = err.status || 'error'; 

    // Log for dev
    console.error('ERROR :', err); 

    // Mongoose bad ObjectId -> Convert to ApiError
    if (err instanceof mongoose.Error.CastError) {
        message = `Resource not found with id ${err.value}`;
        statusCode = 404;
        status = 'fail';
    }

    // Mongoose duplicate key -> Convert to ApiError
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered for: ${field}. Please use another value.`;
        statusCode = 400;
        status = 'fail';
        
    }

    // Mongoose validation error -> Convert to ApiError
    if (err instanceof mongoose.Error.ValidationError) {
        message = Object.values(err.errors).map(val => val.message).join('. ');
        statusCode = 400;
        status = 'fail';
    }

    // Ensure statusCode is a valid number before sending
    if (typeof statusCode !== 'number' || statusCode < 100 || statusCode > 599) {
        console.error('Invalid status code derived:', statusCode, 'Original error:', err);
        statusCode = 500; // Default to 500 if something went wrong
        message = 'Server Error';
        status = 'error';
    }

    // Send the response using the determined values
    res.status(statusCode).json({
        status: status,
        success: false, 
        error: message
    });
};

module.exports = errorHandler;