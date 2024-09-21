const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  getAdminById,
  getAdmin,
  updateAdminPassword,
} = require("../controllers/admin.controller");
const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");

const mAdminCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/admin/login", loginAdmin);
router.post("/admin", mAdminCRUD, createAdmin);
router.get("/admins", mAdminCRUD, getAllAdmins);
router.get("/admin", mAdminCRUD, getAdmin);
router.get("/admin/:id", mAdminCRUD, getAdminById);
router.put("/admin/:id", mAdminCRUD, updateAdmin);
router.delete("/admin/:id", mAdminCRUD, deleteAdmin);
router.put("/admin/password/me", mAdminCRUD, updateAdminPassword);

module.exports = router;
