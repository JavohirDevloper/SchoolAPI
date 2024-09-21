const express = require("express");
const router = express.Router();
const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");
const {
  createComment,
  getAllComments,
  deleteComment,
  getCommentsByNewsId,
} = require("../controllers/comment.controller");
const mCommentCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/news/:newsId/comments", createComment);
router.get("/news/:newsId/comments", getCommentsByNewsId);
router.get("/comments", getAllComments);
router.delete("/comments/:id", mCommentCRUD, deleteComment);

module.exports = router;
