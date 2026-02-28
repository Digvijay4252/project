const db = require('../models');

const User = db.User;

// Get all users (only admin can access)
const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can view all users.' });
    }

    const users = await User.findAll({
      attributes: ['id', 'email', 'full_name', 'user_type', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get own user details
const getMyDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'email', 'full_name', 'user_type', 'created_at']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get my details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get users by type (only admin can access)
const getUsersByType = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can filter users by type.' });
    }

    const { userType } = req.params;

    if (!['user', 'seller', 'admin'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const users = await User.findAll({
      where: { user_type: userType },
      attributes: ['id', 'email', 'full_name', 'user_type', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Get users by type error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllUsers, getMyDetails, getUsersByType };
