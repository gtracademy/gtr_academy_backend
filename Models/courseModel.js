const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, },
    courseBrochure: { type: String, },
    courseDemoVideo: { type: String, },
    courseImage: { type: String, },
    courseDescription: { type: String, },
    courseDuration: { type: String, },
    courseMentorPhoto: { type: String, },
    courseMentorDescription: { type: String, },
    courseCurriculum: { type: String, },
    coursePrice: { type: Number, },
    courseDiscount: { type: Number, },
    courseCategory: { type: String, },
})

const Course = mongoose.model('HomeForm', courseSchema);
module.exports = Course;