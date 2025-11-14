const { readJSON } = require("../utils/fileHandler");
const { getGrade } = require("../utils/grading");

// GET /reports/:studentId
async function getStudentReport(req, res) {
  try {
    const { studentId } = req.params;

    const scores = readJSON("scores.json");

    const studentScores = scores.filter((s) => s.studentId === studentId);

    if (!studentScores.length) {
      return res
        .status(404)
        .json({ message: "No scores found for this student" });
    }

    const subjects = studentScores.map((s) => {
      const total = s.ca + s.exam;
      const grade = getGrade(total);
      return {
        subject: s.subject,
        ca: s.ca,
        exam: s.exam,
        total,
        grade,
      };
    });

    const totalScoreAllSubjects = subjects.reduce((sum, s) => sum + s.total, 0);
    const average = subjects.length
      ? totalScoreAllSubjects / subjects.length
      : 0;

    const report = {
      studentId,
      studentName: studentScores[0].studentName || "",
      totalSubjects: subjects.length,
      average: Number(average.toFixed(2)),
      subjects,
    };

    return res.json(report);
  } catch (err) {
    console.error("Error in getStudentReport:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET /students
async function listStudents(req, res) {
  try {
    const students = readJSON("students.json");
    return res.json(students);
  } catch (err) {
    console.error("Error in listStudents:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getStudentReport,
  listStudents,
};
