const bcrypt = require("bcrypt");
const db = require('../db');

const signUp = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Validate input
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const [existingUser] = await db.execute("SELECT * FROM signUp WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `USER-${Date.now()}`; // Generating userId with a timestamp
    await db.execute(
      `INSERT INTO signUp (firstname, lastname, email, password, userId, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [firstname, lastname, email, hashedPassword, userId]
    );

    // Respond with success
    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
  
  module.exports = { signUp }