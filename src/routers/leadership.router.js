const express = require("express");
const router = express.Router();
const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");
const {
  createLeadership,
  updateLeadership,
  getAllLeadership,
  deleteLeadership,
} = require("../controllers/leadership.controller");

const mLeadershipCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/leadership", mLeadershipCRUD, createLeadership);
router.get("/leadership", getAllLeadership);
router.put("/leadership/:id", mLeadershipCRUD, updateLeadership);
router.delete("/leadership/:id", mLeadershipCRUD, deleteLeadership);

module.exports = router;
