const mongoose = require('mongoose');
const fs = require('fs');
const { parse } = require('json2csv');

const Enrollment = mongoose.model('Enrollment');
const Quiz = mongoose.model('Quiz');
const User = mongoose.model('User');

exports.exportStudentPerformance = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .lean();
    const quizzes = await Quiz.find().lean();

    const data = enrollments.flatMap(enrollment =>
      enrollment.quizScores.map(score => ({
        studentId: enrollment.userId._id,
        studentName: enrollment.userId.name,
        studentEmail: enrollment.userId.email,
        courseId: enrollment.courseId._id,
        courseTitle: enrollment.courseId.title,
        quizId: score.quizId,
        quizTitle: quizzes.find(q => q._id.toString() === score.quizId.toString())?.title || 'Unknown',
        score: score.score,
        totalQuestions: quizzes.find(q => q._id.toString() === score.quizId.toString())?.questions?.length || 0,
        duration: quizzes.find(q => q._id.toString() === score.quizId.toString())?.duration || 5,
        timeUsed: score.timeUsed || 0, // Add timeUsed to quizScores in backend
        submittedAt: score.submittedAt,
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