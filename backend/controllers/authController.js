const db = require('../models');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');

const User = db.User;

// Sign up for both user and seller
const signup = async (req, res) => {
  try {
    const { email, password, fullName, userType } = req.body;

    // Validate input
    if (!email || !password || !fullName || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['user', 'seller', 'admin'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      full_name: fullName,
      user_type: userType
    });

    const token = generateToken(user.id, userType);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email,
        fullName,
        userType
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login for both user and seller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.user_type);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        userType: user.user_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const connection = await pool.getConnection();

    const [users] = await connection.query(
      'SELECT id, email, full_name, user_type, created_at FROM users WHERE id = ?',
      [userId]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: users[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login, getProfile };
