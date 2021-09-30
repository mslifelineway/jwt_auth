const mongoose = require("mongoose");
const { userSchemaObj } = require("../schemas/user");
const bcrypt = require("bcryptjs");
const { schemaOptions } = require("../helpers/helpers");
const _ = require("lodash");
const { statusCodes, roles } = require("../utls/constants");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(userSchemaObj, schemaOptions);

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    return Promise.reject({ status: statusCodes.notFound });
  }
  const check = await bcrypt.compare(password, user.password);
  if (check) {
    return user;
  }
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return _.omit(userObject, ["password"]);
};

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

userSchema.methods.generateRefreshAuthToken = async function () {
  try {
    const buf = await crypto.randomBytes(64);
    return { refreshToken: buf.toString("hex") };
  } catch (refreshAuthTokenError) {
    return { refreshAuthTokenError };
  }
};

userSchema.methods.createSession = async function () {
  const { refreshToken, refreshAuthTokenError } =
    await this.generateRefreshAuthToken();
  if (refreshAuthTokenError) {
    return { refreshAuthTokenError };
  }
  return { refreshToken };
};

userSchema.methods.generateAccessAuthToken = async function () {
  try {
    const accessToken = await jwt.sign(
      { _id: this._id.toHexString(), role: roles.user },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    return { accessToken };
  } catch (accessAuthTokenError) {
    return { accessAuthTokenError };
  }
};

module.exports = mongoose.model("users", userSchema);
