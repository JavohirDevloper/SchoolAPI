const express = require("express");
const router = express.Router();
const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");

const {
  getAllApplication,
  deleteApplication,
  createApplication,
} = require("../controllers/application.controller");

const mApplicationCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/application", createApplication);
router.get("/application", mApplicationCRUD, getAllApplication);
router.delete("/application/:id", mApplicationCRUD, deleteApplication);

module.exports = router;
