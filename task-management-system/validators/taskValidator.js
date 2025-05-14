const Joi = require('joi');

/**
 * Validation schema for creating a new task
 */
exports.createTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot be more than 100 characters',
      'any.required': 'Title is required'
    }),
    
  description: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description cannot be more than 500 characters'
    }),
    
  category: Joi.string()
    .trim()
    .valid('Work', 'Personal', 'Study', 'Health', 'Other')
    .required()
    .messages({
      'string.base': 'Category must be a string',
      'string.empty': 'Category is required',
      'any.required': 'Category is required',
      'any.only': 'Category must be one of: Work, Personal, Study, Health, Other'
    }),
    
  priority: Joi.string()
    .trim()
    .valid('Low', 'Medium', 'High')
    .required()
    .messages({
      'string.base': 'Priority must be a string',
      'string.empty': 'Priority is required',
      'any.required': 'Priority is required',
      'any.only': 'Priority must be one of: Low, Medium, High'
    }),
    
  deadline: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.base': 'Deadline must be a valid date',
      'date.format': 'Deadline must be in ISO format (YYYY-MM-DD)',
      'date.min': 'Deadline must be in the future',
      'any.required': 'Deadline is required'
    }),
    
  completed: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Completed must be a boolean value'
    })
});

/**
 * Validation schema for updating an existing task
 * Same as create schema but all fields are optional
 */
exports.updateTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot be more than 100 characters'
    }),
    
  description: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description cannot be more than 500 characters'
    }),
    
  category: Joi.string()
    .trim()
    .valid('Work', 'Personal', 'Study', 'Health', 'Other')
    .messages({
      'string.base': 'Category must be a string',
      'any.only': 'Category must be one of: Work, Personal, Study, Health, Other'
    }),
    
  priority: Joi.string()
    .trim()
    .valid('Low', 'Medium', 'High')
    .messages({
      'string.base': 'Priority must be a string',
      'any.only': 'Priority must be one of: Low, Medium, High'
    }),
    
  deadline: Joi.date()
    .iso()
    .min('now')
    .messages({
      'date.base': 'Deadline must be a valid date',
      'date.format': 'Deadline must be in ISO format (YYYY-MM-DD)',
      'date.min': 'Deadline must be in the future'
    }),
    
  completed: Joi.boolean()
    .messages({
      'boolean.base': 'Completed must be a boolean value'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
}); 