# Task Management System API

A RESTful API backend for managing tasks with categories, priorities, and deadlines.

## Technology Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Validation**: Joi
- **Testing**: Jest
- **Documentation**: Swagger

## Folder Structure

```
/task-management-system
├── /controllers        # Logic for handling API requests
│   ├── taskController.js
├── /models             # Mongoose models for tasks
│   ├── taskModel.js
├── /routes             # Express route definitions
│   ├── taskRoutes.js
├── /tests              # Unit tests
│   ├── task.test.js
├── /validators         # Validation schemas using Joi
│   ├── taskValidator.js
├── app.js              # Main entry point of the app
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation and instructions
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/task-management
   ```
4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

5. Access the API documentation at: http://localhost:3000/api-docs

## API Endpoints

- `POST /tasks` - Create a new task
- `GET /tasks` - Retrieve all tasks (with optional filters)
- `GET /tasks/:id` - Retrieve a specific task by ID
- `PUT /tasks/:id` - Update an existing task
- `DELETE /tasks/:id` - Delete a task by ID

## Testing

Run tests with:
```
npm test
``` 