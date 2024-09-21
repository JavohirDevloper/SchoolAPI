const express = require("express");
const router = express.Router();
const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");

const {
  createStatistika,
  getAllStatistika,
  updateStatistika,
  deleteStatistika,
} = require("../controllers/statistics.controller");
const mStatisticsCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/statistics", mStatisticsCRUD, createStatistika);
router.get("/statistics", getAllStatistika);
router.put("/statistics/:id", mStatisticsCRUD, updateStatistika);
router.delete("/statistics/:id", mStatisticsCRUD, deleteStatistika);

module.exports = router;
