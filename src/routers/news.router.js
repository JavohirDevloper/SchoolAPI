const express = require("express");
const router = express.Router();
const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");

const {
  createNews,
  getAllNews,
  getNewsByTitle,
  updateNews,
  deleteNews,
} = require("../controllers/news.controller");

const mNewsCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/news", mNewsCRUD, createNews);
router.get("/news", getAllNews);
router.get("/news/title/:title", getNewsByTitle);
router.put("/news/:id", mNewsCRUD, updateNews);
router.delete("/news/:id", mNewsCRUD, deleteNews);

module.exports = router;
