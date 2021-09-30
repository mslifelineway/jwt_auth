const { default: slugify } = require("slugify");

exports.schemaOptions = {
  versionKey: false,
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

exports._copy = (c) => {
  return JSON.parse(JSON.stringify(c));
};
exports._slugify = (name) => {
  if (name) return slugify(name, "_").toLowerCase();
  return "";
};
