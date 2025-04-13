const mongoose = require('mongoose');
const { createTask, getAllTasks, getTaskById, updateTask, updateTaskStatus, deleteTask } = require('../../src/services/taskService');
const Task = require('../../src/models/taskModel');

describe('Task Service', () => {
  // Sample task data
  const sampleTask = {
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending'
  };

  // Test createTask function
  test('should create a new task', async () => {
    const task = await createTask(sampleTask);
    expect(task).toHaveProperty('_id');
    expect(task.title).toBe(sampleTask.title);
    expect(task.description).toBe(sampleTask.description);
    expect(task.status).toBe(sampleTask.status);
  });

  // Test getAllTasks function
  test('should get all tasks with filters and pagination', async () => {
    // Create some test tasks
    await Task.create([
      sampleTask,
      { ...sampleTask, title: 'Another Task', status: 'completed' },
      { ...sampleTask, title: 'Third Task' }
    ]);

    const filters = {};
    const pagination = { page: 1, limit: 10 };
    const sorting = { sortBy: 'createdAt', sortOrder: 'desc' };

    const result = await getAllTasks(filters, pagination, sorting);
    expect(result).toHaveProperty('tasks');
    expect(result).toHaveProperty('pagination');
    expect(result.tasks.length).toBe(3);
  });

  // Test getTaskById function
  test('should get a task by ID', async () => {
    const newTask = await Task.create(sampleTask);
    const task = await getTaskById(newTask._id);
    expect(task._id.toString()).toBe(newTask._id.toString());
    expect(task.title).toBe(sampleTask.title);
  });

  // Test updateTask function
  test('should update a task', async () => {
    const newTask = await Task.create(sampleTask);
    const updatedTaskData = {
      title: 'Updated Title',
      description: 'Updated description'
    };

    const updatedTask = await updateTask(newTask._id, updatedTaskData);
    expect(updatedTask._id.toString()).toBe(newTask._id.toString());
    expect(updatedTask.title).toBe(updatedTaskData.title);
    expect(updatedTask.description).toBe(updatedTaskData.description);
  });

  // Test updateTaskStatus function
  test('should update task status', async () => {
    const newTask = await Task.create(sampleTask);
    const newStatus = 'completed';

    const updatedTask = await updateTaskStatus(newTask._id, newStatus);
    expect(updatedTask._id.toString()).toBe(newTask._id.toString());
    expect(updatedTask.status).toBe(newStatus);
  });

  // Test deleteTask function
  test('should delete a task', async () => {
    const newTask = await Task.create(sampleTask);
    await deleteTask(newTask._id);
    
    const deletedTask = await Task.findById(newTask._id);
    expect(deletedTask).toBeNull();
  });
});