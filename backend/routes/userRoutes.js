// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, refreshToken, getUserById } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.get('/:id', protect, getUserById);

module.exports = router;
