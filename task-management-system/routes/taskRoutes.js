const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateRequest = require('../validators/validateMiddleware');
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidator');

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
 *         id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         category:
 *           type: string
 *           enum: [Work, Personal, Study, Health, Other]
 *           description: The category of the task
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: The priority level of the task
 *         deadline:
 *           type: string
 *           format: date
 *           description: The deadline date for the task
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the task was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the task was last updated
 *       example:
 *         title: Complete project report
 *         description: Finalize the quarterly report for the client
 *         category: Work
 *         priority: High
 *         deadline: 2023-12-15T00:00:00.000Z
 *         completed: false
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management API endpoints
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Creates a new task with the provided details. The deadline must be a future date.
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - priority
 *               - deadline
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task (3-100 characters)
 *                 example: Complete quarterly report
 *               description:
 *                 type: string
 *                 description: Details about the task (optional)
 *                 example: Gather data from all departments and compile it into a PDF report
 *               category:
 *                 type: string
 *                 enum: [Work, Personal, Study, Health, Other]
 *                 description: The category of the task
 *                 example: Work
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 description: The priority level of the task
 *                 example: High
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: The deadline for the task (must be a future date)
 *                 example: 2023-12-15T23:59:59.000Z
 *               completed:
 *                 type: boolean
 *                 description: Whether the task is completed (defaults to false)
 *                 example: false
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: priority
 *                       message:
 *                         type: string
 *                         example: Priority must be one of Low, Medium, High
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/', validateRequest(createTaskSchema), taskController.createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve all tasks
 *     description: Fetch a list of tasks with optional filtering, sorting, and pagination
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Work, Personal, Study, Health, Other]
 *         description: Filter tasks by category
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Filter tasks by priority level
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter tasks by completion status
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort tasks by field(s). Prefix with - for descending order. Multiple fields can be comma-separated.
 *         example: -priority,deadline
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of tasks per page
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include in the response
 *         example: title,deadline,priority
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   description: Number of tasks returned
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/', taskController.getAllTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Retrieve detailed information about a specific task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to retrieve
 *         example: 6159b6a8b12d4a35f8b1f9c7
 *     responses:
 *       200:
 *         description: The task information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Task not found
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/:id', taskController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Update task information by ID. At least one field must be provided for update.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update
 *         example: 6159b6a8b12d4a35f8b1f9c7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task (3-100 characters)
 *                 example: Updated report title
 *               description:
 *                 type: string
 *                 description: Details about the task
 *                 example: Updated task description with new details
 *               category:
 *                 type: string
 *                 enum: [Work, Personal, Study, Health, Other]
 *                 description: The category of the task
 *                 example: Personal
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 description: The priority level of the task
 *                 example: Medium
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: The deadline for the task (must be a future date)
 *                 example: 2023-12-20T23:59:59.000Z
 *               completed:
 *                 type: boolean
 *                 description: Whether the task is completed
 *                 example: true
 *     responses:
 *       200:
 *         description: The task was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: priority
 *                       message:
 *                         type: string
 *                         example: Priority must be one of Low, Medium, High
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Task not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.put('/:id', validateRequest(updateTaskSchema), taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Remove a task from the database by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete
 *         example: 6159b6a8b12d4a35f8b1f9c7
 *     responses:
 *       204:
 *         description: Task deleted successfully (no content returned)
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Task not found
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Invalid ID format
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router; 