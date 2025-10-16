const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseBrochure: { type: String },
    courseDemoVideo: { type: String },
    courseDescription: { type: String },
    courseOverview: {type:String}, 
    courseDuration: { type: String },
    courseCurriculum: [
  {
    title: { type: String, required: true },
    details: { type: String, required: true }
  }
],
    courseUrl: { type: String, }, 
    coursePrice: {
        online: { type: Number, required: true },   
        offline: { type: Number, required: true }   
    },
    courseDiscount: {
        online: { type: Number, default: 0 },  
        offline: { type: Number, default: 0 }   
    },
    courseCategory: { type: String },
    courseImage: {
        local: String,
        cloud: String
    },
      courseBannerImage: {
        local: String,
        cloud: String
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
        required: true
    }
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;


