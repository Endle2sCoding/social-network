const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user-controller');
const authenticateToken = require('../middleware/auth');
// const { UserController } = require('../controllers');

const uploadDestination = 'uploads';

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
// Роуты User
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/users/:id", authenticateToken, UserController.getUserById);
router.get("/current", authenticateToken, UserController.current);
router.put("/users/:id", authenticateToken, UserController.updateUser);
module.exports = router;