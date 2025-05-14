const Task = require('../models/taskModel');

/**
 * Create a new task
 * @route POST /tasks
 */
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all tasks with optional filtering
 * @route GET /tasks
 */
exports.getAllTasks = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get a specific task by ID
 * @route GET /tasks/:id
 */
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update a task by ID
 * @route PUT /tasks/:id
 */
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run validators on update
      }
    );
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Delete a task by ID
 * @route DELETE /tasks/:id
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 