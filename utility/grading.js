// Simple grading scale (you can tweak if you like)
// 70-100: A
// 60-69 : B
// 50-59 : C
// 45-49 : D
// 40-44 : E
// 0-39  : F

function getGrade(totalScore) {
  if (totalScore >= 70) return "A";
  if (totalScore >= 60) return "B";
  if (totalScore >= 50) return "C";
  if (totalScore >= 45) return "D";
  if (totalScore >= 40) return "E";
  return "F";
}

module.exports = {
  getGrade,
};
