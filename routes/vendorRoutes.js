const express = require("express");
const router = express.Router();
const vendorCtrl = require("../controllers/vendorController");
const { auth } = require("../middleware/authMiddleware");

// register and login
router.route("/register").post(vendorCtrl.register);
router.route("/login").post(vendorCtrl.login);
// update userProfile
router.route("/:id").patch(auth, vendorCtrl.updateProfile);
// update password
router.route('/change-password').post(auth,vendorCtrl.updatePassword);
// get vendor
router.route("/get-vendor").get(auth,vendorCtrl.getVendor);
module.exports = router;
