const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getUserEnrollments,
  getCourseEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
  submitQuizScore
} = require('../controllers/enrollmentController.js');
const {
  protect,
  restrictToAdminInstructor,
  restrictToCourseAccess,
  restrictToSelf,
  restrictToSelfOrAdmin
} = require('../middlewares/authMiddleware.js');
const {
  validateProgressUpdate,
  validateQuizScore,
} = require('../utils/validators/enrollmentValidator.js');

const { validate } = require("../middlewares/validationMiddleware");


router.post(
  '/courses/:courseId',
  restrictToSelf,
  createEnrollment
);

router.get('/user', getUserEnrollments);
router.get('/courses/:courseId', restrictToAdminInstructor, getCourseEnrollments);


router.route("/:enrollmentId")
     .get('/:enrollmentId', restrictToCourseAccess, getEnrollmentById)
     .put(
        restrictToAdminInstructor,
         validateProgressUpdate,
         validate,
         updateEnrollment
        )
     .delete(restrictToSelfOrAdmin, deleteEnrollment);


router.post(
  '/:enrollmentId/quiz-scores',
  restrictToSelf,
  validateQuizScore,
  validate,
  submitQuizScore
);

module.exports = router