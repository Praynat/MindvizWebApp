import Joi from "joi";

const contactSchema = {
  name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.base": "Name should be a type of text",
      "string.empty": "Name is required",
      "string.min": "Name should have a minimum length of 2",
      "string.max": "Name should have a maximum length of 30",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .regex(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)
    .required()
    .messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email is required",
      "string.pattern.base": "Please enter a valid email",
      "any.required": "Email is required",
    }),

  message: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.base": "Message should be a type of text",
      "string.empty": "Message is required",
      "string.min": "Message should have a minimum length of 10",
      "string.max": "Message should have a maximum length of 500",
      "any.required": "Message is required",
    }),
};

export default contactSchema;
