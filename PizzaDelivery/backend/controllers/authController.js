const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// Helper to sign JWT token
const getSignedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretpizzatokenkey123!@#', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Send response helper
const sendTokenResponse = (user, statusCode, res) => {
  const token = getSignedToken(user._id);

  // Remove password from response
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create user
    user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'user', // Can register as admin if needed for development, or secure it
    });

    // Get verification token
    const verifyToken = user.getVerificationToken();

    await user.save();

    // Create verification URL
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verifyToken}`;
    
    // For frontend client-side navigation
    const hostIp = req.get('host').split(':')[0];
    const clientVerifyUrl = `http://${hostIp}:5173/verify-email/${verifyToken}`;

    const message = `Welcome to Pizza Shop, ${name}!\n\nPlease verify your email by clicking the link below:\n\n${clientVerifyUrl}\n\nIf you did not request this, please ignore this email.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #e53e3e; text-align: center;">🍕 Welcome to Pizza Shop!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${clientVerifyUrl}" style="background-color: #319795; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #718096;">${clientVerifyUrl}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
        <p style="font-size: 12px; color: #a0aec0; text-align: center;">If you did not register, please ignore this message.</p>
      </div>
    `;

    try {
      const emailResult = await sendEmail({
        email: user.email,
        subject: '🍕 Pizza Crafters Account Verification',
        message,
        html,
      });

      const isRealSend = emailResult && !emailResult.fallback;

      res.status(201).json({
        success: true,
        emailSent: isRealSend,
        message: isRealSend
          ? 'Registration successful! Verification email sent.'
          : 'Registration successful! (Developer fallback active)',
      });
    } catch (err) {
      // Clear token fields and save
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'User registered but verification email could not be sent. Fallback activated, please check server logs.',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    // Hash token from request
    const token = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    // Set verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Account not verified. Please check your email for the verification link.',
        unverified: true,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset URL
    const hostIp = req.get('host').split(':')[0];
    const resetUrl = `http://${hostIp}:5173/reset-password/${resetToken}`;

    const message = `You requested a password reset on Pizza Shop.\n\nPlease reset your password by clicking the link below:\n\n${resetUrl}\n\nThis link is valid for 1 hour. If you did not request this, please ignore.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #e53e3e; text-align: center;">🍕 Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #718096;">${resetUrl}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
        <p style="font-size: 12px; color: #a0aec0; text-align: center;">If you did not request a password reset, please ignore this email. Your password will remain secure.</p>
      </div>
    `;

    try {
      const emailResult = await sendEmail({
        email: user.email,
        subject: '🍕 Pizza Crafters Password Reset',
        message,
        html,
      });

      const isRealSend = emailResult && !emailResult.fallback;

      res.status(200).json({
        success: true,
        emailSent: isRealSend,
        message: isRealSend
          ? 'Password reset link sent to email'
          : 'Password reset fallback activated: check server console for the link'
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ success: false, message: 'Email could not be sent. Fallback activated, please check server logs.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Hash token from request
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
