const express = require('express');

const router = express.Router();

const {
  createQuiz,
  getAllQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController.js');
const { protect,restrictToAdminInstructor, restrictToCourseAccess } = require('../middlewares/authMiddleware');
const  {validateQuiz} = require('../utils/validators/quizValidator');
const { validate } = require("../middlewares/validationMiddleware");

router.post('/courses/:courseId/quiz',
    protect,
    restrictToAdminInstructor,
    validateQuiz,
    validate,
     createQuiz
    );
router.get('/courses/:courseId/quizzes', protect, getAllQuizzes)
router.route("/:id")
      .get(protect,restrictToCourseAccess, getQuiz)
      .put(protect,restrictToAdminInstructor,validateQuiz, validate, updateQuiz)
      .delete(protect,restrictToAdminInstructor, deleteQuiz)

module.exports = router