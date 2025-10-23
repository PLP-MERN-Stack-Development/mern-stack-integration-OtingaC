const Joi = require('joi');

const postValidator = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(200).required(),
    content: Joi.string().required(),
    category: Joi.string().required()
  });

  return schema.validate(data);
};

const categoryValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().max(200).allow('')
  });

  return schema.validate(data);
};

module.exports = { postValidator, categoryValidator };