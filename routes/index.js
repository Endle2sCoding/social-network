const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user-controller');
const authenticateToken = require('../middleware/auth');
const { PostController } = require('../controllers');
PostController;

const uploadDestination = 'uploads';

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
// User routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/users/:id", authenticateToken, UserController.getUserById);
router.get("/current", authenticateToken, UserController.current);
router.put("/users/:id", authenticateToken, UserController.updateUser);

// Posts routes
router.post('/posts', authenticateToken, PostController.createPost);
router.post('/posts', authenticateToken, PostController.getAllPosts);
router.post('/posts/:id', authenticateToken, PostController.getPostById);
router.post('/posts/:id', authenticateToken, PostController.deletePost);



module.exports = router;