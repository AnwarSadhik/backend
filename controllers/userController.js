const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "please add all required fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ error: "User already exists" });
  }
  if (password.length < 6) return res.status(400).json({ error: "password must be at least 6 characters" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      // token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ error: "Invalid User Data" });
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      accessToken: generateToken(user._id),
    });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body);

    if (!updateUser) {
      res.status(400).json({ error: "User Not found" });
    }

    return res.status(200).json(updateUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "Please require all fields" });

    if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ error: "Invalid Curernt password" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ msg: "password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getUser = async (req, res) => {
  res.status(200).json(req.user);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};