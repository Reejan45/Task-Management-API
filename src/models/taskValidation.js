const Joi = require('joi');

const taskValidation = {
  create: Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().required(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending')
  }),
  
  update: Joi.object({
    title: Joi.string().max(100),
    description: Joi.string(),
    status: Joi.string().valid('pending', 'in-progress', 'completed')
  }).min(1),
  
  status: Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'completed').required()
  })
};

module.exports = taskValidation;