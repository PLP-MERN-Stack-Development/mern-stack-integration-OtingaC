const Joi = require('joi');

const commentValidator = (data) => {
  const schema = Joi.object({
    post: Joi.string().required(),
    content: Joi.string().max(500).required()
  });

  return schema.validate(data);
};

module.exports = { commentValidator };