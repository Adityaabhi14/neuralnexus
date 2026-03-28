const express = require("express");
const { getPosts, createPost, likePost, getProfilePosts, commentPost } = require("../controllers/postController");

const router = express.Router();

router.route("/").get(getPosts).post(createPost);
router.route("/profile/:author").get(getProfilePosts);
router.route("/:id/like").patch(likePost);
router.route("/:id/comment").post(commentPost);

module.exports = router;
