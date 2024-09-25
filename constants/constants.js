const Joi = require("joi");

// import Joi from "joi"

 const email = Joi.string().email().required().messages({
    "string.email": `Email must be a valid email`,
    "string.empty": `Email cannot be an empty field`,
    "any.required": `Email is a required field`,
  })
  
   const password = Joi.string().min(6).max(128).required().messages({
    "string.base": `Password should be a type of 'text'`,
    "string.empty": `Password cannot be an empty field`,
    "string.min": `Password should have a minimum length of {#limit}`,
    "string.max": `Password should have a maximum length of {#limit}`,
    "any.required": `Password is a required field`,
  })
  
 const phoneNumber = Joi.string().min(10).max(10).required().messages({
    "string.base": `Phone number should be a type of 'text'`,
    "string.empty": `Phone number cannot be an empty field`,
    "string.min": `Phone number should have a minimum length of {#limit}`,
    "string.max": `Phone number should have a maximum length of {#limit}`,
    "any.required": `Phone number is a required field`,
  })

const userName = Joi.string().min(3).max(30).required().messages({
    "string.base": `Name should be a type of 'text'`,
    "string.empty": `Name cannot be an empty field`,
    "string.min": `Name should have a minimum length of {#limit}`,
    "string.max": `Name should have a maximum length of {#limit}`,
    "any.required": `Name is a required field`,
  })

   const role = Joi.string().required()
  export const dialCode = Joi.string().required()
  
   module.exports={userName, password, email,phoneNumber, role,}
