const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");

const auth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");
      // Get vendor from the token
      req.vendor = await Vendor.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

module.exports = { auth };
