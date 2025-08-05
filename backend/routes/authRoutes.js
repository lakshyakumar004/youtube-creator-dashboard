const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authControllers');
const protect = require('../middlewares/authMiddleware'); // ✅ Add this

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// ✅ Protected test route
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user, // contains userId and role from token
  });
});

module.exports = router;
