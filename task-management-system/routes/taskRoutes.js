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
 *   description: Task management API
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid task data
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
 *                         example: title
 *                       message:
 *                         type: string
 *                         example: Title is required
 */
router.post('/', validateRequest(createTaskSchema), taskController.createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve a list of tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Task category
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Task priority
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Task completion status
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by field (e.g., deadline,priority)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
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
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 */
router.get('/', taskController.getAllTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/:id', taskController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The task was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid task data
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
 *                         example: deadline
 *                       message:
 *                         type: string
 *                         example: Deadline must be in the future
 *       404:
 *         description: Task not found
 */
router.put('/:id', validateRequest(updateTaskSchema), taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router; 