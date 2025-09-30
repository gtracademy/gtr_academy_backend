const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name:{
        type:String
    },
     designation:{
        type:String
    },
     photo:{
        type:String
    },
     bio:{
        type:String
    }
})

const Mentor = mongoose.model("Mentor",mentorSchema)

module.exports = Mentor;