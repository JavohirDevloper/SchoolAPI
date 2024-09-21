const express = require("express");
const router = express.Router();
const isLoggedIn = require("../shared/auth/isLoggedIn");
const hasRole = require("../shared/auth/hasRole");
const {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacher.controller");

const mTeacherCRUD = [isLoggedIn, hasRole(["admin"])];

router.post("/teachers", mTeacherCRUD, createTeacher);
router.get("/teachers", getAllTeachers);
router.put("/teachers/:id", mTeacherCRUD, updateTeacher);
router.delete("/teachers/:id", mTeacherCRUD, deleteTeacher);

module.exports = router;
