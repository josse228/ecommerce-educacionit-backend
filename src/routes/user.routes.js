const express = require("express");
const router = express.Router();
//importamos los controlles que son los que manejan la logica
const userController = require("../controllers/user.controller");

//Middlewares
const auth = require("../middlewares/auth.middleware")
const isAdmin = require("../middlewares/isAdmin.middleware")

// Diseñamos las rutas express.Router()

router.get("/users", userController.getUser);

router.get("/users/:id", userController.getUserById)

router.post("/users", userController.createUser);

router.put("/users/:id", [auth], userController.updateUser);

router.delete("/users/:id", [auth, isAdmin], userController.deleteUserById);

router.post("/login", userController.loginUser)

module.exports = router;

