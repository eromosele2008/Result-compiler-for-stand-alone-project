const express = require("express");
const {
  getStudentReport,
  listStudents,
} = require("../controllers/report.controller");

module.exports = function (app) {
  const router = express.Router();
  const auth = app.auth;

  // Students can view their own report
  // Teachers/Admins can view any student's report
  router.get(
    "/reports/:studentId",
    auth(["student", "teacher", "admin"]),
    (req, res, next) => {
      const { studentId } = req.params;
      const user = req.user;

      if (user.role === "student" && user.userId !== studentId) {
        return res
          .status(403)
          .json({ message: "Forbidden: Cannot view another student report" });
      }

      return getStudentReport(req, res, next);
    }
  );

  // List all recorded students (Teacher/Admin only)
  router.get("/students", auth(["teacher", "admin"]), listStudents);

  return router;
};
