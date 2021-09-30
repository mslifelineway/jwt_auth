exports.userSchemaObj = {
  name: {
    type: String,
    required: true,
    min: 3,
    max: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 50,
    trim: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  deactivated_at: {
    type: Date,
  },
};
