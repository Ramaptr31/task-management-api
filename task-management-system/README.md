# Task Management System API

A comprehensive RESTful API backend for managing tasks with categories, priorities, and deadlines. This system allows users to create, read, update, and delete tasks while providing filtering, sorting, and validation capabilities.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [Create a Task](#create-a-task)
  - [Get All Tasks](#get-all-tasks)
  - [Get Task by ID](#get-task-by-id)
  - [Update a Task](#update-a-task)
  - [Delete a Task](#delete-a-task)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [API Documentation](#api-documentation)

## Technology Stack

- **Backend Framework**: [Express.js](https://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) - A NoSQL database that provides flexibility and scalability, along with Mongoose ODM for schema validation and modeling.
- **Validation**: [Joi](https://joi.dev/) - A powerful schema description language and data validator for JavaScript.
- **Testing**: [Jest](https://jestjs.io/) - A delightful JavaScript Testing Framework with a focus on simplicity.
- **Documentation**: [Swagger](https://swagger.io/) - Industry standard API documentation with interactive UI.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Validation**: Input validation for all API endpoints
- **Filtering**: Filter tasks by category, priority, or completion status
- **Sorting**: Sort tasks by different fields in ascending or descending order
- **Pagination**: Limit the number of tasks returned in a single request
- **Documentation**: Interactive API documentation with Swagger

## Project Structure

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

## Design Decisions

1. **Clean Architecture**
   - Separation of concerns with controllers, models, routes, and validators
   - Clear boundaries between layers of the application
   - Independent modules that can be tested and maintained separately

2. **MongoDB with Mongoose**
   - NoSQL database chosen for its flexibility and scalability
   - Mongoose provides schema validation and type checking
   - Document-based structure works well for task management

3. **Joi Validation**
   - Schema-based validation to ensure data integrity
   - Detailed error messages for validation failures
   - Separate validation schemas for task creation and updates

4. **RESTful API Design**
   - Standard HTTP methods (GET, POST, PUT, DELETE)
   - Resource-based URLs following REST conventions
   - Appropriate status codes for different scenarios

5. **Filtering and Sorting**
   - Query parameter-based filtering for flexible querying
   - Multiple sort options to organize task listings
   - Pagination to handle large datasets efficiently

6. **Swagger Documentation**
   - Interactive API documentation for easy testing and discovery
   - Detailed endpoint descriptions, request parameters, and response formats
   - Examples of valid requests and error responses

## Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/task-management
   NODE_ENV=development
   ```
   
   If you are using MongoDB Atlas, your connection string will look like:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/task-management
   ```

4. Start the application:
   - For development (with auto-restart):
     ```
     npm run dev
     ```
   - For production:
     ```
     npm start
     ```

5. The API is now running at `http://localhost:3000`
   - Access the API documentation at: `http://localhost:3000/api-docs`

## API Endpoints

### Create a Task

**POST /tasks**

Creates a new task with the provided details.

**Request Body:**
```json
{
  "title": "Complete project report",
  "description": "Finalize the quarterly report for the client",
  "category": "Work",
  "priority": "High",
  "deadline": "2023-12-15T00:00:00.000Z"
}
```

**Required Fields:**
- `title`: String, required, 3-100 characters
- `category`: String, required, one of: Work, Personal, Study, Health, Other
- `priority`: String, required, one of: Low, Medium, High
- `deadline`: Date, required, must be in the future

**Optional Fields:**
- `description`: String, up to 500 characters
- `completed`: Boolean, defaults to false

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "task": {
      "_id": "6159b6a8b12d4a35f8b1f9c7",
      "title": "Complete project report",
      "description": "Finalize the quarterly report for the client",
      "category": "Work",
      "priority": "High",
      "deadline": "2023-12-15T00:00:00.000Z",
      "completed": false,
      "createdAt": "2023-10-03T12:00:00.000Z",
      "updatedAt": "2023-10-03T12:00:00.000Z"
    }
  }
}
```

### Get All Tasks

**GET /tasks**

Retrieves a list of all tasks with optional filtering, sorting, and pagination.

**Query Parameters:**
- `category`: Filter tasks by category (e.g., Work, Personal, Study)
- `priority`: Filter tasks by priority (Low, Medium, High)
- `completed`: Filter tasks by completion status (true/false)
- `sort`: Sort tasks by field(s), prefix with - for descending order (e.g., deadline,-priority)
- `page`: Page number for pagination (default: 1)
- `limit`: Number of tasks per page (default: 10)
- `fields`: Comma-separated list of fields to include in the response

**Example:**
```
GET /tasks?category=Work&priority=High&sort=-deadline&page=1&limit=5
```

**Response (200 OK):**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "tasks": [
      {
        "_id": "6159b6a8b12d4a35f8b1f9c7",
        "title": "Complete project report",
        "category": "Work",
        "priority": "High",
        "deadline": "2023-12-15T00:00:00.000Z",
        "completed": false,
        "createdAt": "2023-10-03T12:00:00.000Z",
        "updatedAt": "2023-10-03T12:00:00.000Z"
      },
      {
        "_id": "6159b6a8b12d4a35f8b1f9c8",
        "title": "Prepare client presentation",
        "category": "Work",
        "priority": "High",
        "deadline": "2023-12-10T00:00:00.000Z",
        "completed": false,
        "createdAt": "2023-10-03T14:00:00.000Z",
        "updatedAt": "2023-10-03T14:00:00.000Z"
      }
    ]
  }
}
```

### Get Task by ID

**GET /tasks/:id**

Retrieves a specific task by its ID.

**URL Parameters:**
- `id`: The MongoDB ID of the task

**Example:**
```
GET /tasks/6159b6a8b12d4a35f8b1f9c7
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "task": {
      "_id": "6159b6a8b12d4a35f8b1f9c7",
      "title": "Complete project report",
      "description": "Finalize the quarterly report for the client",
      "category": "Work",
      "priority": "High",
      "deadline": "2023-12-15T00:00:00.000Z",
      "completed": false,
      "createdAt": "2023-10-03T12:00:00.000Z",
      "updatedAt": "2023-10-03T12:00:00.000Z"
    }
  }
}
```

### Update a Task

**PUT /tasks/:id**

Updates an existing task by its ID.

**URL Parameters:**
- `id`: The MongoDB ID of the task to update

**Request Body (all fields optional):**
```json
{
  "title": "Updated project report title",
  "priority": "Medium",
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "task": {
      "_id": "6159b6a8b12d4a35f8b1f9c7",
      "title": "Updated project report title",
      "description": "Finalize the quarterly report for the client",
      "category": "Work",
      "priority": "Medium",
      "deadline": "2023-12-15T00:00:00.000Z",
      "completed": true,
      "createdAt": "2023-10-03T12:00:00.000Z",
      "updatedAt": "2023-10-04T09:30:00.000Z"
    }
  }
}
```

### Delete a Task

**DELETE /tasks/:id**

Deletes a task by its ID.

**URL Parameters:**
- `id`: The MongoDB ID of the task to delete

**Example:**
```
DELETE /tasks/6159b6a8b12d4a35f8b1f9c7
```

**Response (204 No Content)**

## Error Handling

The API returns appropriate HTTP status codes and error messages for different scenarios:

- **400 Bad Request**: Invalid input data, validation failures
- **404 Not Found**: Task with the specified ID doesn't exist
- **500 Internal Server Error**: Unexpected server issues

**Example Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "priority",
      "message": "Priority must be one of: Low, Medium, High"
    },
    {
      "field": "deadline",
      "message": "Deadline must be in the future"
    }
  ]
}
```

## Testing

The project includes unit tests for all API endpoints and validation logic. To run the tests:

```
npm test
```

This will execute the Jest test suite and display the results with code coverage information.

## API Documentation

Interactive API documentation is available via Swagger UI. After starting the application, navigate to:

```
http://localhost:3000/api-docs
```

This provides a user-friendly interface to:
- View all available endpoints
- Test API calls directly from the browser
- See request/response formats and examples
- Read detailed descriptions of each endpoint and parameter 