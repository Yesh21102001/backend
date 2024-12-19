const db = require('../db');

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists with matching email and password
    const [user] = await db.execute('SELECT * FROM signUp WHERE email = ? AND password = ?', [email, password]);

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Success - User found and logged in
    res.status(200).json({
      message: "Login successful",
      userId: user[0].userId,
      firstname: user[0].firstname,
      lastname: user[0].lastname
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if user exists with provided email
    const [user] = await db.execute('SELECT * FROM signUp WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    await db.execute('UPDATE signUp SET otp = ?, otp_expiration = ? WHERE email = ?', [otp, otpExpiration, email]);
    console.log(`OTP for ${email}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully. Please check your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }
  try {
    const [user] = await db.execute('SELECT * FROM signUp WHERE email = ? AND otp = ? AND otp_expiration > NOW()', [email, otp]);
    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }
    await db.execute('UPDATE signUp SET password = ?, otp = NULL, otp_expiration = NULL WHERE email = ?', [newPassword, email]);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { login, forgotPassword, verifyOtpAndResetPassword };