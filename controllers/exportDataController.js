const mongoose = require('mongoose');
const fs = require('fs');
const { parse } = require('json2csv');

const Enrollment = mongoose.model('Enrollment');
const Quiz = mongoose.model('Quiz');
const User = mongoose.model('User');

exports.exportStudentPerformance = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'userName email')
      .populate('course', 'title')
      .lean();
    const quizzes = await Quiz.find().lean();

    const data = enrollments.flatMap(enrollment =>
      enrollment.quizScores.map(score => ({
        studentId: enrollment.user._id,
        studentName: enrollment.user.name,
        studentEmail: enrollment.user.email,
        courseId: enrollment.course._id,
        courseTitle: enrollment.course.title,
        quizId: quizzes._id,
        quizTitle: quizzes.find(q => q._id.toString() === quizzes.quizId.toString())?.title || 'Unknown',
        score: quizzes.quizScores.score,
        totalQuestions: quizzes.find(q => q._id.toString() === quizzes.quizId.toString())?.questions?.length || 0,
        duration: quizzes.find(q => q._id.toString() === quizzes.quizId.toString())?.duration || 5,
        timeUsed: quizzes.quizScores.timeUsed || 0, // Add timeUsed to quizScores in backend
        submittedAt: quizzes.quizScores.completedAt,
      }))
    );

    const fields = ['studentId', 'studentName', 'studentEmail', 'courseId', 'courseTitle', 'quizId', 'quizTitle', 'score', 'totalQuestions', 'duration', 'timeUsed', 'submittedAt'];
    const csv = parse(data, { fields });
    fs.writeFileSync('student_performance.csv', csv);
    res.download('student_performance.csv');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};