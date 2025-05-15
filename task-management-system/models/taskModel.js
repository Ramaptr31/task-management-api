const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - priority
 *         - deadline
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the task
 *           example: 6159b6a8b12d4a35f8b1f9c7
 *         title:
 *           type: string
 *           description: The title of the task
 *           example: Implement user authentication
 *         description:
 *           type: string
 *           description: A detailed description of the task
 *           example: Set up JWT authentication with refresh tokens for the app
 *         category:
 *           type: string
 *           enum: [Work, Personal, Study, Health, Other]
 *           description: The category the task belongs to
 *           example: Work
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: The priority level of the task
 *           example: High
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: The deadline for the task (must be a future date)
 *           example: 2023-12-31T23:59:59.000Z
 *         completed:
 *           type: boolean
 *           description: Whether the task has been completed
 *           default: false
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was created
 *           example: 2023-10-15T10:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was last updated
 *           example: 2023-10-20T15:45:00.000Z
 */

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