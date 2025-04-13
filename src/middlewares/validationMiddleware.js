const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  
  if (error) {
    const message = error.details.map(detail => detail.message).join(', ');
    return next(new ApiError(message, 400));
  }
  
  next();
};

module.exports = validate;