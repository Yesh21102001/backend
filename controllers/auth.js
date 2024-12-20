const nodemailer = require('nodemailer');
const db = require('../db');

// Signup controller
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    const [existingUser] = await db.query('SELECT * FROM auth WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert new user with a 5-character userId
    const [result] = await db.query(
      'INSERT INTO auth (userId, firstName, lastName, email, password) VALUES (CONCAT(SUBSTRING(MD5(RAND()), 1, 5)), ?, ?, ?, ?)',
      [firstName, lastName, email, password]
    );

    // Respond with success
    return res.status(201).json({ message: 'User signed up successfully', userId: result.insertId });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Error signing up', error: error.message });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query the database to find the user
    const [auth] = await db.query('SELECT * FROM auth WHERE email = ?', [email]);
    
    if (auth.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (auth[0].password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    return res.status(200).json({ message: 'Login successful', userId: auth[0].userId });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
};

// Forgot password controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Query the database to find the user
    const [auth] = await db.query('SELECT * FROM auth WHERE email = ?', [email]);

    if (auth.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP (for simplicity, let's use a random 6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via email (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'OTP for password reset',
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP', error });
      } else {
        // Store OTP in the database for later comparison
        await db.query('UPDATE users SET otp = ? WHERE email = ?', [otp, email]);
        return res.status(200).json({ message: 'OTP sent to your email' });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error sending OTP', error });
  }
};

// Reset password controller
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Query the database to find the user
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user[0].otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update the password and clear the OTP
    await db.query('UPDATE users SET password = ?, otp = NULL WHERE email = ?', [password, email]);

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Error resetting password', error });
  }
};

module.exports = { signup, login, forgotPassword, resetPassword };