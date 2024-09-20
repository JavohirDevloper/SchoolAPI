const express = require("express");
const router = express.Router();

const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");
const {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
} = require("../controllers/gallarey.controller");

const mGalleryCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/gallery", mGalleryCRUD, createGallery);
router.get("/gallery", getAllGallery);
router.get("/gallery/:id", getGalleryById);
router.put("/gallery/:id", mGalleryCRUD, updateGallery);
router.delete("/gallery/:id", mGalleryCRUD, deleteGallery);

module.exports = router;
