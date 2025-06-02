const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    },
    passingScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
  },{
    timestamps: true
  });


  const Quiz = mongoose.model('Quiz', quizSchema);

  module.exports = Quiz;