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
} = require("../controllers/admin.controller");
const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");

const mRegisterAdmin = [isLoggedIn, hasRole(["admin"])];
const mCreateAdmin = [isLoggedIn, hasRole(["admin"])];
const mGetAllAdmins = [isLoggedIn, hasRole(["admin"])];
const mGetByIdAdmin = [isLoggedIn, hasRole(["admin"])];
const mUpdateAdmin = [isLoggedIn, hasRole(["admin"])];
const mAdmin = [isLoggedIn, hasRole(["admin"])];
const mDeleteAdmin = [isLoggedIn, hasRole(["admin"])];

router.post("/admin/login", loginAdmin);
router.post("/admin", mCreateAdmin, createAdmin);
router.get("/admins", mGetAllAdmins, getAllAdmins);
router.get("/admin", mAdmin, getAdmin);
router.get("/admin/:id", mGetByIdAdmin, getAdminById);
router.put("/admin/:id", mUpdateAdmin, updateAdmin);
router.delete("/admin/:id", mDeleteAdmin, deleteAdmin);

module.exports = router;
