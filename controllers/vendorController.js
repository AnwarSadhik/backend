const Vendor = require("../models/vendorModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { shopName, shopOwner, gender, email, password, contactNo, address } =
      req.body;

    if (
      !shopName ||
      !shopOwner ||
      !gender ||
      !email ||
      !password ||
      !contactNo ||
      !address
    ) {
      return res.status(400).json({ message: "please require all fields" });
    }

    const vendorExists = await Vendor.findOne({ email });

    if (vendorExists) {
      res.status(400).json({ error: "User already exists" });
    }

    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "password must be at least 6 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const vendor = await Vendor.create({
      shopName,
      shopOwner,
      gender,
      email,
      password: hashedPassword,
      contactNo,
      address,
    });
    if (vendor) {
      res.status(201).json({
        _id: vendor.id,
        name: vendor.name,
        email: vendor.email,
      });
    } else {
      res.status(400).json({ error: "Invalid Vendor Data" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const vendor = await Vendor.findOne({ email });

  if (vendor && (await bcrypt.compare(password, vendor.password))) {
    res.json({
      _id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      accessToken: generateToken(vendor._id),
    });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const updateUser = await Vendor.findByIdAndUpdate(req.params.id, req.body);

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
    const vendor = await Vendor.findById(req.vendor.id);

    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "Please require all fields" });

    if (newPassword.length < 6)
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });

    const isMatch = await bcrypt.compare(currentPassword, vendor.password);

    if (!isMatch) {
      res.status(400).json({ error: "Invalid Curernt password" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    vendor.password = hashedPassword;
    await vendor.save();

    res.status(200).json({ msg: "password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.getVendor = async (req, res) => {
  res.status(200).json(req.vendor);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
