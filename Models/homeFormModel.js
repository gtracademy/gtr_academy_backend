const mongoose = require('mongoose');

const homeFormSchema = new mongoose.Schema({
    name: { type: String, required: false },
    phone: { type: Number, required: false, Min: 10, Max: 10},
})

const HomeForm = mongoose.model('CourseForm', homeFormSchema);
module.exports = HomeForm;