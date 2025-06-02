const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
    const authToken = req.headers.authorization

    if(authToken){
      
  try {
    const token = authToken.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      console.log(`User not found for ID: ${decoded.id}`);
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    console.log(`User authenticated: ${req.user.email}`);
    next();
  } catch (error) {
    console.error(`Token verification failed: ${error.message}`);
    res.status(401);
    throw new Error('Not authorized, invalid token');
  }
    }else{
        return res.status(401).json({message : "no token provided , access denied"})
    }

});

exports.restrictToAdminInstructor = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    console.log('req.user is undefined in restrictToAdminInstructor');
    res.status(401);
    throw new Error('Not authorized, no user');
  }
  if (req.user.role.toLowerCase() === 'admin' || req.user.role.toLowerCase() === 'instructor') {
    next();
  } else {
    console.log(`Unauthorized role: ${req.user.role}`);
    res.status(403);
    throw new Error('Not authorized, admin or instructor only');
  }
});

exports.restrictToSelf = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    console.log('req.user is undefined in restrictToSelf');
    res.status(401);
    throw new Error('Not authorized, no user');
  }
  if (req.user._id.toString() === req.params.id || req.user._id.toString() === req.body.userId) {
    next();
  } else {
    console.log(`User ${req.user._id} not authorized for ID: ${req.params.id || req.body.userId}`);
    res.status(403);
    throw new Error('Not authorized, only the user themselves');
  }
});

exports.restrictToSelfOrAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    console.log('req.user is undefined in restrictToSelfOrAdmin');
    res.status(401);
    throw new Error('Not authorized, no user');
  }
  if (req.user._id.toString() === req.params.id || req.user.role.toLowerCase() === 'admin') {
    next();
  } else {
    console.log(`User ${req.user._id} not authorized for ID: ${req.params.id}`);
    res.status(403);
    throw new Error('Not authorized, only the user themselves or admin');
  }
});

exports.restrictToCourseAccess = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    console.log('req.user is undefined in restrictToCourseAccess');
    res.status(401);
    throw new Error('Not authorized, no user');
  }
  const enrollment = await require('../models/Enrollment').findById(req.params.enrollmentId);
  if (
    req.user.role.toLowerCase() === 'admin' ||
    (enrollment && enrollment.user.toString() === req.user._id.toString()) ||
    (enrollment && enrollment.course.instructor.toString() === req.user._id.toString())
  ) {
    next();
  } else {
    console.log(`User ${req.user._id} not authorized for enrollment: ${req.params.enrollmentId}`);
    res.status(403);
    throw new Error('Not authorized to access this enrollment');
  }
});




