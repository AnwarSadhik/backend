const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");
const { auth } = require("../middleware/authMiddleware");

// login and register
router.route("/register").post(userCtrl.registerUser);
router.route("/login").post(userCtrl.loginUser);
// update userProfile
router.route("/:id").patch(auth, userCtrl.updateProfile);
// get User
router.route('/get-user').get(auth,userCtrl.getUser);
// update password
router.route('/change-password').post(auth,userCtrl.updatePassword);
//refresh token
module.exports = router;