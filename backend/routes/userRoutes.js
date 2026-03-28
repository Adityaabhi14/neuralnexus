const express = require("express");
const { getUserProfile, updateProfile, followUser, getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/profile/:username").get(getUserProfile);
router.route("/profile").patch(updateProfile);
router.route("/follow").patch(followUser);

module.exports = router;
