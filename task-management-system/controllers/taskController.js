const Task = require('../models/taskModel');
const { AppError } = require('../utils/errorHandler');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * Create a new task
 * @route POST /tasks
 */
exports.createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      task
    }
  });
});

/**
 * Get all tasks with optional filtering
 * @route GET /tasks
 */
exports.getAllTasks = asyncHandler(async (req, res) => {
  // Build query
  const queryObj = { ...req.query };
  
  // Fields to exclude from filtering
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(field => delete queryObj[field]);
  
  // Filter by specific fields if provided
  let query = Task.find(queryObj);
  
  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    // Default sort by deadline (ascending)
    query = query.sort('deadline');
  }
  
  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  query = query.skip(skip).limit(limit);
  
  // Execute query
  const tasks = await query;
  
  // Return response
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks
    }
  });
});

/**
 * Get a specific task by ID
 * @route GET /tasks/:id
 */
exports.getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return next(new AppError('Task not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

/**
 * Update a task by ID
 * @route PUT /tasks/:id
 */
exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // Return the updated document
      runValidators: true // Run validators on update
    }
  );
  
  if (!task) {
    return next(new AppError('Task not found', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

/**
 * Delete a task by ID
 * @route DELETE /tasks/:id
 */
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  
  if (!task) {
    return next(new AppError('Task not found', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
}); 