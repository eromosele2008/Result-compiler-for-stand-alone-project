const { readJSON, writeJSON } = require('../utils/fileHandler');

// POST /scores
// Body: { studentId, studentName, subject, ca, exam }
async function addOrUpdateScore(req, res) {
  try {
    const { studentId, studentName, subject, ca, exam } = req.body;

    if (!studentId || !subject) {
      return res.status(400).json({ message: 'studentId and subject are required' });
    }

    const caScore = Number(ca) || 0;
    const examScore = Number(exam) || 0;

    // --- Update scores.json ---
    const scores = readJSON('scores.json');

    const existingIndex = scores.findIndex(
      (s) => s.studentId === studentId && s.subject === subject
    );

    const scoreRecord = {
      studentId,
      studentName: studentName  (scores[existingIndex]?.studentName  ''),
      subject,
      ca: caScore,
      exam: examScore,
    };

    if (existingIndex >= 0) {
      scores[existingIndex] = scoreRecord;
    } else {
      scores.push(scoreRecord);
    }

    writeJSON('scores.json', scores);

    // --- Update students.json (simple list of students + subjects) ---
    const students = readJSON('students.json');

    let student = students.find((s) => s.studentId === studentId);

    if (!student) {
      student = {
        studentId,
        name: studentName || '',
        subjects: [subject],
      };
      students.push(student);
    } else {
      if (studentName && !student.name) {
        student.name = studentName;
      }
      if (!student.subjects.includes(subject)) {
        student.subjects.push(subject);
      }
    }

    writeJSON('students.json', students);

    return res.status(201).json({
      message: 'Score saved successfully',
      data: scoreRecord,
    });
  } catch (err) {
    console.error('Error in addOrUpdateScore:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addOrUpdateScore,
};