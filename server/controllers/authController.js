const User = require("../models/User");
const { signToken } = require("../utils/token");

const register = async (req, res) => {
  try {
    console.log("Register hit with body:", req.body);   // DEBUG

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");         // DEBUG
      return res
        .status(400)
        .json({ message: "Email and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Email already exists");              // DEBUG
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ email, password });
    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // handle validation errors nicely
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
