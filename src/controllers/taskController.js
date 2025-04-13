
const {createTask, getAllTasks, getTaskById ,updateTask, updateTaskStatus, deleteTask} = require('../services/taskService');

// Create a new task
exports.createTask = async (req, res, next) => {
  const  task  = req.body;
  try {
    const createdTask = await createTask(task);
    res.status(201).json({
      success: true,
      data: createdTask
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks with pagination, sorting and filtering
exports.getAllTasks = async (req, res, next) => {
  const filters = {
    status: req.query.status,
    search: req.query.search,
    fromDate: req.query.fromDate,
    toDate: req.query.toDate
  };
  
  const pagination = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10
  };
  
  const sorting = {
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };
  
  try {
    const result = await getAllTasks(filters, pagination, sorting);    
    res.status(200).json({
        success: true,
        count: result.tasks.length,
        pagination: result.pagination,
        data: result.tasks
    });    

  } catch (error) {
    next(error);
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await getTaskById(id);  
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Update a task
exports.updateTask = async (req, res, next) => {
  const {id}  = req.params;
  const updateData = req.body;
  
  try {
    const updatedTask = await updateTask(id, updateData);
    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// Update only task status
exports.updateTaskStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const task = await updateTaskStatus(id, status);
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    await deleteTask(id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};