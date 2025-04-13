const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Task = require('../../src/models/taskModel');
const taskController = require('../../src/controllers/taskController');

// Configure middleware
app.use(express.json());

// Set up routes for testing
app.post('/tasks', taskController.createTask);
app.get('/tasks', taskController.getAllTasks);
app.get('/tasks/:id', taskController.getTaskById);
app.put('/tasks/:id', taskController.updateTask);
app.patch('/tasks/:id/status', taskController.updateTaskStatus);
app.delete('/tasks/:id', taskController.deleteTask);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
});

describe('Task Controller', () => {
  const sampleTask = {
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending'
  };

  // Test create task endpoint
  test('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ task : sampleTask });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('title', sampleTask.title);
  });

  // Test get all tasks endpoint
  test('should get all tasks', async () => {
    // Create test tasks first
    await Task.create([
      sampleTask,
      { ...sampleTask, title: 'Another Task' }
    ]);

    const res = await request(app).get('/tasks');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.count).toBeGreaterThanOrEqual(2);
  });

  // Test get task by ID
  test('should get a task by ID', async () => {
    const task = await Task.create(sampleTask);
    
    const res = await request(app).get(`/tasks/${task._id}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', task._id.toString());
  });

  // Test update task
  test('should update a task', async () => {
    const task = await Task.create(sampleTask);
    const updateData = {
      title: 'Updated Test Task',
      description: 'Updated description'
    };
    
    const res = await request(app)
      .put(`/tasks/${task._id}`)
      .send(updateData);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('title', updateData.title);
    expect(res.body.data).toHaveProperty('description', updateData.description);
  });

  // Test update task status
  test('should update task status', async () => {
    const task = await Task.create(sampleTask);
    const newStatus = 'completed';
    
    const res = await request(app)
      .patch(`/tasks/${task._id}/status`)
      .send({ status: newStatus });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('status', newStatus);
  });

  // Test delete task
  test('should delete a task', async () => {
    const task = await Task.create(sampleTask);
    
    const res = await request(app).delete(`/tasks/${task._id}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    
    // Verify task is deleted
    const deletedTask = await Task.findById(task._id);
    expect(deletedTask).toBeNull();
  });
});