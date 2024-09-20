const express = require("express");
const router = express.Router();

const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");
const {
  createCarousel,
  getAllCarousels,
  getCarouselById,
  updateCarousel,
  deleteCarousel,
} = require("../controllers/carusel.controller");

const mCaruselCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/carousel", mCaruselCRUD, createCarousel);
router.get("/carousel", getAllCarousels);
router.get("/carousel/:id", getCarouselById);
router.put("/carousel/:id", mCaruselCRUD, updateCarousel);
router.delete("/carousel/:id", mCaruselCRUD, deleteCarousel);

module.exports = router;
