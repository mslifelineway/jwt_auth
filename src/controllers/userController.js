const { _copy } = require("../helpers/helpers");
const { UserModel } = require("../models");
const { statusCodes, messages } = require("../utls/constants");

exports.saveUser = async (req, res, next) => {
  try {
    const savedUser = await new UserModel(req.body).save();
    if (savedUser) {
      return res
        .status(statusCodes.created)
        .json({ message: messages.userCreated, user: _copy(savedUser) });
    }
    return next({
      message: messages.userNotCreated,
    });
  } catch (e) {
    if (e && e.code === 11000) {
      e.status = statusCodes.conflict;
      e.message = messages.userAlreadyExists;
    }
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.body.id },
      req.body
    );
    if (updatedUser) {
      return res.status(statusCodes.noContent).send();
    }
    return next({
      message: messages.userNotExists,
      status: statusCodes.notFound,
    });
  } catch (e) {
    const { path } = e;
    if (path) {
      e.message = messages.invalidUserId;
    }
    next(e);
  }
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findA({});
    return res
      .status(statusCodes.success)
      .json({ users: _copy(users), message: messages.allUsersFetched });
  } catch (e) {
    next(e);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (user)
      return res
        .status(statusCodes.success)
        .json({ users: _copy(user.toJSON()), message: messages.userFetched });
    return next({
      message: messages.userNotExists,
      status: statusCodes.notFound,
    });
  } catch (e) {
    const { path } = e;
    if (path) {
      e.message = messages.invalidUserId;
    }
    return next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByCredentials(email, password);
    if (!user) {
      return next({
        message: messages.wrongCredentials,
        status: statusCodes.unauthorized,
      });
    }
    if (!user.is_active) {
      return next({ message: messages.accountDisabled });
    }
    const { refreshToken, refreshAuthTokenError, saveSessionError } =
      await user.createSession();
    if (refreshAuthTokenError || !refreshToken) {
      return next({
        status: statusCodes.internalServerError,
        message: messages.refreshAuthTokenNotGenerated,
      });
    }
    if (saveSessionError) {
      return next({
        status: statusCodes.internalServerError,
        message: messages.sessionCouldNotSaved,
      });
    }

    const { accessToken, accessAuthTokenError } =
      await user.generateAccessAuthToken();
    if (accessAuthTokenError || !accessToken) {
      return next({
        status: statusCodes.internalServerError,
        message: messages.accessTokenNotGenerated,
      });
    }

    return res
      .header("x-refresh-token", refreshToken)
      .header("x-access-token", accessToken)
      .status(statusCodes.success)
      .json({
        message: messages.authenticated,
        user,
      });
  } catch (e) {
    console.log("====> e; ", e);
    if (e.status === statusCodes.notFound) {
      e.message = messages.userNotExists;
      return next(e);
    }
    const { path } = e;
    if (path) {
      e.message = messages.invalidUserId;
    }
    return next(e);
  }
};
