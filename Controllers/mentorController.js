const mentorModel = require('../Models/mentorModel');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Show all mentors
exports.showMentors = async (req, res) => {
  try {
    const mentors = await mentorModel.find({});
    res.render('mentorHome', { mentors });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching mentors');
  }
};

// Render Add Mentor Form
exports.renderAddMentorForm = (req, res) => {
  res.render("mentorAdd");
};

// Handle Add Mentor
exports.addMentor = async (req, res) => {
  try {
    const { name, designation, bio } = req.body;
    let photoUrl = "";

    // Upload image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "mentors" });
      photoUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // delete local file
    }

    // Save mentor
    await mentorModel.create({
      name,
      designation,
      photo: photoUrl,
      bio
    });

    res.redirect("/mentor");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding mentor");
  }
};

// Render Edit Mentor Form
exports.renderEditMentorForm = async (req, res) => {
  try {
    const mentor = await mentorModel.findById(req.params.id);
    if (!mentor) return res.status(404).send("Mentor not found");
    res.render("mentorUpdate", { mentor });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading mentor");
  }
};

// Handle Edit Mentor
exports.editMentor = async (req, res) => {
  try {
    const { name, designation, bio } = req.body;
    let photoUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "mentors" });
      photoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    await mentorModel.findByIdAndUpdate(req.params.id, {
      name,
      designation,
      bio,
      ...(photoUrl && { photo: photoUrl })
    });

    res.redirect("/mentor");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating mentor");
  }
};

// Handle Delete Mentor
exports.deleteMentor = async (req, res) => {
  try {
    await mentorModel.findByIdAndDelete(req.params.id);
    res.redirect("/mentor");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting mentor");
  }
};
