const {
  userSchema,
  updateUserSchema,
  userLoginSchema,
} = require("../schemaValidations/userSchemaValidation");
const { statusCodes, messages } = require("../utls/constants");

exports.validateSchema = async (req, res, next) => {
  try {
    await userSchema().validateAsync(req.body);
    return next();
  } catch (e) {
    if (e.details) {
      const details = e.details[0];
      e.status = statusCodes.unproccessible;
      if (details.type === "any.required") e.status = statusCodes.badRequest;
      e.message = details.message;
    }
    next(e);
  }
};

exports.validateUpdateSchema = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    await updateUserSchema().validateAsync(req.body);
    return next();
  } catch (e) {
    if (e.details) {
      const details = e.details[0];
      e.status = statusCodes.unproccessible;
      if (details.type === "any.required") e.status = statusCodes.badRequest;
      e.message = details.message;
    }
    next(e);
  }
};
exports.loginValidation = async (req, res, next) => {
  try {
    await userLoginSchema().validateAsync(req.body);
    next();
  } catch (e) {
    if (e.details) {
      const details = e.details[0];
      e.status = statusCodes.unproccessible;
      if (details.type === "any.required") e.status = statusCodes.badRequest;
      e.message = details.message;
    }
    next(e);
  }
};
