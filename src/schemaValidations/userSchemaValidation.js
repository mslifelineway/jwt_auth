const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
exports.userSchema = () => {
  const labels = {
    name: "Name",
    email: "Email",
    password: "Password",
  };
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.base": `${labels.name} should be a type of 'text'.`,
        "string.empty": `${labels.name} should not be empty.`,
        "string.min": `${labels.name} must contain min {#limit} chars.`,
        "string.max": `${labels.name} should not have more than {#limit} chars.`,
        "any.required": `Please provide your ${labels.name}.`,
      }),
    email: Joi.string()
      .trim()
      .empty()
      .min(6)
      .max(50)
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "in", "org"] },
      })
      .required()
      .messages({
        "string.base": `${labels.email} should be a type of 'text'.`,
        "string.empty": `${labels.email} should not be empty.`,
        "string.min": `${labels.email} should have a minimum length of {#limit}.`,
        "string.email": `Only .com, .net, .in or .org allowed.`,
        "any.required": `Please provide your ${labels.email}.`,
      }),
    password: Joi.string()
      .trim()
      .empty()
      .min(8)
      .max(15)
      .pattern(
        new RegExp(
          /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,15})$/
        )
      )
      .required()
      .messages({
        "string.base": `${labels.password} should be a type of 'text'.`,
        "string.empty": `${labels.password} should not be empty.`,
        "string.min": `${labels.password} must contain at least {#limit} character.`,
        "string.max": `${labels.password} should not contain more than  {#limit} character.`,
        "string.pattern.base": `${labels.password} must contain one uppercase character, one lowercase character, one digit and one special character.`,
        "any.required": `Please provide the ${labels.password}.`,
      }),
  });
  return schema;
};

exports.updateUserSchema = () => {
  const labels = {
    id: "User Id",
    name: "Name",
  };
  const schema = Joi.object({
    id: Joi.objectId()
      .empty()
      .required()
      .messages({
        "string.base": `${labels.id} should be a type of 'objectId'.`,
        "string.empty": `${labels.id} should not be empty.`,
        "string.pattern.name": `Please provide the valid ${labels.id}.`,
        "any.required": `${labels.id} is required.`,
      }),
    name: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .messages({
        "string.base": `${labels.name} should be a type of 'text'.`,
        "string.empty": `${labels.name} should not be empty.`,
        "string.min": `${labels.name} must contain min {#limit} chars.`,
        "string.max": `${labels.name} should not have more than {#limit} chars.`,
      }),
  });
  return schema;
};

exports.userLoginSchema = () => {
  const labels = {
    email: "Email",
    password: "Password",
  };
  return Joi.object({
    email: Joi.string()
      .trim()
      .empty()
      .min(6)
      .max(50)
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "in", "org"] },
      })
      .required()
      .messages({
        "string.base": `${labels.email} should be a type of 'text'.`,
        "string.empty": `${labels.email} should not be empty.`,
        "string.min": `${labels.email} should have a minimum length of {#limit}.`,
        "string.email": `Only .com, .net, .in or .org allowed.`,
        "any.required": `${labels.email} is required!.`,
      }),
    password: Joi.string()
      .trim()
      .empty()
      .min(8)
      .max(15)
      .pattern(
        new RegExp(
          /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,15})$/
        )
      )
      .required()
      .messages({
        "string.base": `${labels.password} should be a type of 'text'.`,
        "string.empty": `${labels.password} should not be empty.`,
        "string.min": `${labels.password} must contain at least {#limit} character.`,
        "string.max": `${labels.password} should not contain more than  {#limit} character.`,
        "string.pattern.base": `${labels.password} must contain one uppercase character, one lowercase character, one digit and one special character.`,
        "any.required": `${labels.password} is required.`,
      }),
  });
};
