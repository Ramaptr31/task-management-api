const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Task title cannot be more than 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Task description cannot be more than 500 characters']
    },
    category: {
      type: String,
      required: [true, 'Task category is required'],
      trim: true,
      enum: {
        values: ['Work', 'Personal', 'Study', 'Health', 'Other'],
        message: 'Category must be one of: Work, Personal, Study, Health, Other'
      }
    },
    priority: {
      type: String,
      required: [true, 'Task priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be one of: Low, Medium, High'
      }
    },
    deadline: {
      type: Date,
      required: [true, 'Task deadline is required'],
      validate: {
        validator: function(value) {
          // Deadline should be a future date (unless it's an update and deadline has passed)
          return this.isNew ? value > Date.now() : true;
        },
        message: 'Deadline must be a future date'
      }
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Add index for faster queries
taskSchema.index({ category: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ completed: 1 });

// Create and export the model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 