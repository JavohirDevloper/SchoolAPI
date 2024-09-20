const express = require("express");
const router = express.Router();

const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");
const {
  createAbout,
  getAllAbouts,
  getAboutById,
  updateAbout,
  deleteAbout,
} = require("../controllers/about.controller");

const mAboutPageCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/about", mAboutPageCRUD, createAbout);
router.get("/about", getAllAbouts);
router.get("/about/:id", getAboutById);
router.put("/about/:id", mAboutPageCRUD, updateAbout);
router.delete("/about/:id", mAboutPageCRUD, deleteAbout);

module.exports = router;
