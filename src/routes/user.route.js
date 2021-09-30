const {
  saveUser,
  updateUser,
  getAllUsers,
  getUserById,
  login,
} = require("../controllers/userController");
const {
  validateSchema,
  validateUpdateSchema,
  loginValidation,
} = require("../middlewares/userMiddleware");

module.exports = (router) => {
  router.post("/register", validateSchema, saveUser);
  router.patch("/:id/update", validateUpdateSchema, updateUser);
  router.get("/", getAllUsers);
  router.get("/:id", getUserById);
  router.post("/login", loginValidation, login);
  return router;
};
