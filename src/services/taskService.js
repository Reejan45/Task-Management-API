const Task = require('../models/taskModel');
const ApiError = require('../utils/apiError');

const createTask = async (taskData) => {
    try {
        return await Task.create(taskData);
    } catch (e) {
        throw new ApiError(400, 'Error creating Task');  
    }
}

const getAllTasks = async(filters, pagination, sorting) => {
    try {
        const { status, search, fromDate, toDate } = filters;
        const { page, limit } = pagination;
        const { sortBy, sortOrder } = sorting;
        
        const query = {};
        const skip = (page - 1) * limit;
        
        // Apply filters
        if (status) query.status = status;
        
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ];
        }
        
        if (fromDate && toDate) {
          query.createdAt = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
          };
        }
        
        // Count total documents for pagination
        const total = await Task.countDocuments(query);
        
        // Execute query with sorting and pagination
        const tasks = await Task.find(query)
          .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
          .skip(skip)
          .limit(limit);
        
        return {
          tasks,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit
          }
        };
    } catch {
        throw new ApiError(500, 'Error fetching tasks');  
    }
}

const getTaskById = async(id) => {
    try {
        return await Task.findById(id);
    } catch {
        throw new ApiError(404, 'Task not found');  
    }
}

const updateTask = async(id, updateData) => {
    try {
        const task = await Task.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });
        return task;
    } catch {
        throw new ApiError(404, 'Task not found');  
    }
}

const updateTaskStatus = async(id, status) => {
    try {
        const task = await Task.findByIdAndUpdate(id, { status }, {
            new: true,
            runValidators: true
        });
        return task; 
    } catch {
        throw new ApiError(404, 'Task not found');
    }
}

const deleteTask = async(id) => {
    try {
        return await Task.findByIdAndDelete(id);
    } catch {
        throw new ApiError(404, 'Task not found');  
    }
}

module.exports ={
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus
};
