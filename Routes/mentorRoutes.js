const express = require('express');
const mentorModel = require('../Models/mentorModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();
const adminAuth = require('../Middlewares/authMiddleware')

const router = express.Router();

// ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ---------------- MULTER CONFIG ----------------
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// ---------------- ROUTES ----------------


// Mentor Show

router.get('/',async(req,res)=>{
  const mentors = await mentorModel.find({})
  res.render('mentorHome',{mentors})
})

// GET Add Mentor Form
router.get('/add', (req, res) => {
  res.render("mentorAdd"); 
});

// POST Add Mentor

router.post('/add', upload.single("photo"), async (req, res) => {
  try {
    const { name, designation, bio, } = req.body;
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

    res.redirect("/mentor"); // go to mentor list
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding mentor");
  }
});



// GET All Mentors (list page)
// router.get('/', async (req, res) => {
//   try {
//     const mentors = await mentorModel.find();
//     res.render("mentorList", { mentors }); // pass mentors to EJS
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error fetching mentors");
//   }
// });

// GET Edit Mentor Form
router.get('/edit/:id', adminAuth, async (req, res) => {
  try {
    const mentor = await mentorModel.findById(req.params.id);
    if (!mentor) return res.status(404).send("Mentor not found");
    res.render("mentorUpdate", { mentor });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading mentor");
  }
});

// PUT Update Mentor
router.post('/edit/:id', upload.single("photo"), async (req, res) => {
  try {
    const { name, designation, bio } = req.body;
    let photoUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mentors"
      });
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
});

// DELETE Mentor
router.post('/delete/:id', adminAuth, async (req, res) => {
  try {
    await mentorModel.findByIdAndDelete(req.params.id);
    res.redirect("/mentor");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting mentor");
  }
});

module.exports = router;
