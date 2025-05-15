const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Task = require('../models/taskModel');

// Setup and teardown
beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  // Clear the database before each test
  await Task.deleteMany({});
});

afterAll(async () => {
  // Disconnect from database
  await mongoose.connection.close();
});

// Sample task data for testing
const sampleTask = {
  title: 'Test Task',
  description: 'This is a test task',
  category: 'Work',
  priority: 'Medium',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  completed: false
};

// Sample task for update tests
const updateData = {
  title: 'Updated Task',
  priority: 'High'
};

// TESTS FOR POST /tasks (CREATE)
describe('POST /tasks - Create a new task', () => {
  
  test('Should create a new task with valid data', async () => {
    const response = await request(app)
      .post('/tasks')
      .send(sampleTask)
      .expect(201);
    
    // Verify response structure
    expect(response.body.status).toBe('success');
    expect(response.body.data.task).toHaveProperty('_id');
    expect(response.body.data.task.title).toBe(sampleTask.title);
    expect(response.body.data.task.category).toBe(sampleTask.category);
    expect(response.body.data.task.priority).toBe(sampleTask.priority);
    
    // Verify task is in the database
    const taskInDb = await Task.findById(response.body.data.task._id);
    expect(taskInDb).toBeTruthy();
    expect(taskInDb.title).toBe(sampleTask.title);
  });
  
  test('Should return 400 if title is missing', async () => {
    const invalidTask = { ...sampleTask };
    delete invalidTask.title;
    
    const response = await request(app)
      .post('/tasks')
      .send(invalidTask)
      .expect(400);
    
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Validation error');
    
    // Verify no task was created
    const count = await Task.countDocuments();
    expect(count).toBe(0);
  });
  
  test('Should return 400 if priority is invalid', async () => {
    const invalidTask = { 
      ...sampleTask,
      priority: 'InvalidPriority' // not one of Low, Medium, High
    };
    
    const response = await request(app)
      .post('/tasks')
      .send(invalidTask)
      .expect(400);
    
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Validation error');
    expect(response.body.errors.some(err => 
      err.message.includes('Priority must be one of')
    )).toBeTruthy();
  });
  
  test('Should return 400 if deadline is in the past', async () => {
    const invalidTask = { 
      ...sampleTask,
      deadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // yesterday
    };
    
    const response = await request(app)
      .post('/tasks')
      .send(invalidTask)
      .expect(400);
    
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Validation error');
    expect(response.body.errors.some(err => 
      err.message.includes('Deadline must be in the future')
    )).toBeTruthy();
  });
});

// TESTS FOR GET /tasks (READ ALL)
describe('GET /tasks - Get all tasks', () => {
  
  beforeEach(async () => {
    // Insert two tasks
    await Task.create([
      sampleTask,
      {
        ...sampleTask,
        title: 'Second Task',
        category: 'Personal',
        priority: 'Low'
      }
    ]);
  });
  
  test('Should get all tasks', async () => {
    const response = await request(app)
      .get('/tasks')
      .expect(200);
    
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(2);
    expect(Array.isArray(response.body.data.tasks)).toBeTruthy();
    expect(response.body.data.tasks).toHaveLength(2);
  });
  
  test('Should filter tasks by category', async () => {
    const response = await request(app)
      .get('/tasks?category=Personal')
      .expect(200);
    
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(1);
    expect(response.body.data.tasks[0].category).toBe('Personal');
  });
  
  test('Should filter tasks by priority', async () => {
    const response = await request(app)
      .get('/tasks?priority=Low')
      .expect(200);
    
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(1);
    expect(response.body.data.tasks[0].priority).toBe('Low');
  });
  
  test('Should sort tasks by specified field', async () => {
    const response = await request(app)
      .get('/tasks?sort=title')
      .expect(200);
    
    expect(response.body.status).toBe('success');
    expect(response.body.data.tasks[0].title).toBe('Second Task');
    expect(response.body.data.tasks[1].title).toBe('Test Task');
  });
  
  test('Should support pagination', async () => {
    const response = await request(app)
      .get('/tasks?page=1&limit=1')
      .expect(200);
    
    expect(response.body.status).toBe('success');
    expect(response.body.results).toBe(1);
    expect(response.body.data.tasks).toHaveLength(1);
  });
});

// TESTS FOR GET /tasks/:id (READ ONE)
describe('GET /tasks/:id - Get a specific task', () => {
  let task;
  
  beforeEach(async () => {
    // Insert a task and save its ID
    task = await Task.create(sampleTask);
  });
  
  test('Should get a task by ID', async () => {
    const response = await request(app)
      .get(`/tasks/${task._id}`)
      .expect(200);
    
    expect(response.body.status).toBe('success');
    expect(response.body.data.task._id).toBe(task._id.toString());
    expect(response.body.data.task.title).toBe(task.title);
  });
  
  test('Should return 404 for non-existent task', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    
    const response = await request(app)
      .get(`/tasks/${nonExistentId}`)
      .expect(404);
    
    expect(response.body.status).toBe('fail');
    expect(response.body.message).toBe('Task not found');
  });
  
  test('Should return 400 for invalid ID format', async () => {
    const response = await request(app)
      .get('/tasks/invalid-id')
      .expect(400);
    
    expect(response.body.status).toBe('fail');
    expect(response.body.message).toContain('Invalid');
  });
});

// TESTS FOR PUT /tasks/:id (UPDATE)
describe('PUT /tasks/:id - Update a task', () => {
  let task;
  
  beforeEach(async () => {
    // Insert a task and save its ID
    task = await Task.create(sampleTask);
  });
  
  test('Should update a task with valid data', async () => {
    const response = await request(app)
      .put(`/tasks/${task._id}`)
      .send(updateData)
      .expect(200);
    
    expect(response.body.status).toBe('success');
    expect(response.body.data.task.title).toBe(updateData.title);
    expect(response.body.data.task.priority).toBe(updateData.priority);
    
    // Verify task is updated in the database
    const updatedTask = await Task.findById(task._id);
    expect(updatedTask.title).toBe(updateData.title);
    expect(updatedTask.priority).toBe(updateData.priority);
  });
  
  test('Should return 404 for non-existent task', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    
    const response = await request(app)
      .put(`/tasks/${nonExistentId}`)
      .send(updateData)
      .expect(404);
    
    expect(response.body.status).toBe('fail');
    expect(response.body.message).toBe('Task not found');
  });
  
  test('Should return 400 for invalid update data', async () => {
    const invalidData = { 
      priority: 'InvalidPriority' // not one of Low, Medium, High
    };
    
    const response = await request(app)
      .put(`/tasks/${task._id}`)
      .send(invalidData)
      .expect(400);
    
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Validation error');
  });
});

// TESTS FOR DELETE /tasks/:id (DELETE)
describe('DELETE /tasks/:id - Delete a task', () => {
  let task;
  
  beforeEach(async () => {
    // Insert a task and save its ID
    task = await Task.create(sampleTask);
  });
  
  test('Should delete a task by ID', async () => {
    await request(app)
      .delete(`/tasks/${task._id}`)
      .expect(204);
    
    // Verify task is removed from database
    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });
  
  test('Should return 404 for non-existent task', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    
    const response = await request(app)
      .delete(`/tasks/${nonExistentId}`)
      .expect(404);
    
    expect(response.body.status).toBe('fail');
    expect(response.body.message).toBe('Task not found');
  });
}); 