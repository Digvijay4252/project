const express = require('express');
const { getAllUsers, getMyDetails, getUsersByType } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getMyDetails);
router.get('/all', authMiddleware, getAllUsers);
router.get('/type/:userType', authMiddleware, getUsersByType);

module.exports = router;
