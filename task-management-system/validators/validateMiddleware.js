/**
 * Middleware for validating request data against Joi schemas
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, params, query)
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // return all errors, not just the first one
      stripUnknown: true, // remove unknown keys
      errors: {
        wrap: {
          label: false // don't wrap error labels
        }
      }
    });

    if (error) {
      // Format validation errors
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors
      });
    }

    // Replace request data with validated data
    req[property] = value;
    next();
  };
};

module.exports = validateRequest; 