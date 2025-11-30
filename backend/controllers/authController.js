// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// helper: ensure secrets exist
function getSecret(name) {
  const val = process.env[name];
  if (!val) {
    console.error(`[AUTH] Missing env var: ${name}`);
    throw new Error(`Server misconfiguration: ${name} missing`);
  }
  return val;
}

const generateTokens = (user) => {
  // defensive: ensure secrets exist before signing
  const accessSecret = getSecret('JWT_SECRET');
  const refreshSecret = getSecret('JWT_REFRESH_SECRET');

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    accessSecret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    refreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    // validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // check user existence
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Save the hashed password in the same field your User model expects.
    // Here we use `passwordHash`. If your model uses `password` instead,
    // change the key to `password: passwordHash`.
    const user = new User({
      name,
      email,
      passwordHash,
      role: role || 'user'
    });

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('[REGISTER] error:', error && error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // adapt to whatever field you used when saving the hash.
    // If you saved hash as `passwordHash`, use that; otherwise use `password`.
    const hash = user.passwordHash ?? user.password;
    if (!hash) {
      console.error('[LOGIN] user has no password hash for id:', user._id);
      return res.status(500).json({ message: 'Server error' });
    }

    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return res.json({
      message: 'Logged in successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('[LOGIN] error:', error && error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body || {};

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const refreshSecret = getSecret('JWT_REFRESH_SECRET');
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('[REFRESH] error:', error && error.message);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};
