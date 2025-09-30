const mongoose = require('mongoose');

const courseFormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
})

const CourseForm = mongoose.model('CourseForm', courseFormSchema);
module.exports = CourseForm;