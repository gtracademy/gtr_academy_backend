const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const Course = require('../Models/courseModel');
const Mentor = require('../Models/mentorModel');
require('dotenv').config();
const adminAuth = require('../Middlewares/authMiddleware');

const router = express.Router();

// ------------------------
// Cloudinary config
// ------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ------------------------
// Local Multer storage
// ------------------------
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// ------------------------
// Helper: slugify
// ------------------------
const slugify = (text) => {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')      // spaces -> dashes
    .replace(/[^\w\-]+/g, '')  // remove non-word chars
    .replace(/\-\-+/g, '-');   // replace multiple - with single -
};

// ------------------------
// ROUTES
// ------------------------

// Render Add Course Form
router.get('/', adminAuth, async (req, res) => {
  const mentors = await Mentor.find({});
  const categories = ["SAP", "Data", "Other"];
  res.render('courseAdd', { mentors, categories });
});

// ------------------------
// ADD COURSE
// ------------------------
router.post('/submit-form-course', upload.fields([
  { name: 'courseImage', maxCount: 1 },
  { name: 'courseBannerImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const courseImagePath = req.files?.courseImage?.[0]?.path || null;
    const courseBannerImagePath = req.files?.courseBannerImage?.[0]?.path || null;

    let cloudCourseImage = null;
    let cloudBannerImage = null;

    if (courseImagePath) {
      const result = await cloudinary.uploader.upload(courseImagePath, { folder: 'Courses' });
      cloudCourseImage = result.secure_url;
      fs.unlinkSync(courseImagePath);
    }

    if (courseBannerImagePath) {
      const result = await cloudinary.uploader.upload(courseBannerImagePath, { folder: 'Courses/Banners' });
      cloudBannerImage = result.secure_url;
      fs.unlinkSync(courseBannerImagePath);
    }

    let finalCategory = req.body.courseCategory;
    if (finalCategory === 'Other' && req.body.customCategory) {
      finalCategory = req.body.customCategory.trim();
    }

    const onlinePrice = Number(req.body.coursePrice?.online || 0);
    const offlinePrice = Number(req.body.coursePrice?.offline || 0);
    const onlineDiscount = Number(req.body.courseDiscount?.online || 0);
    const offlineDiscount = Number(req.body.courseDiscount?.offline || 0);

    let courseSlug = req.body.courseSlug?.trim();
    if (!courseSlug) {
      courseSlug = slugify(req.body.courseTitle);
    }
    courseSlug += '-' + Date.now();

    let parsedCurriculum = [];
    if (req.body.courseCurriculum) {
      const curriculumData = req.body.courseCurriculum;
      if (!Array.isArray(curriculumData)) {
        parsedCurriculum.push({
          title: curriculumData.title,
          details: curriculumData.details,
        });
      } else {
        parsedCurriculum = curriculumData.map((item) => ({
          title: item.title,
          details: item.details,
        }));
      }
    }

    const newCourse = new Course({
      courseTitle: req.body.courseTitle,
      courseUrl: courseSlug,
      courseBrochure: req.body.courseBrochure,
      courseDemoVideo: req.body.courseDemoVideo,
      courseDescription: req.body.courseDescription,
      courseOverview: req.body.courseOverview,
      courseDuration: req.body.courseDuration,
      courseCurriculum: parsedCurriculum,
      coursePrice: {
        online: onlinePrice,
        offline: offlinePrice
      },
      courseDiscount: {
        online: onlineDiscount,
        offline: offlineDiscount
      },
      courseCategory: finalCategory,
      courseImage: {
        local: null,
        cloud: cloudCourseImage
      },
      courseBannerImage: {
        local: null,
        cloud: cloudBannerImage
      },
      mentor: req.body.mentor
    });

    await newCourse.save();
    res.redirect('/');
  } catch (error) {
    console.error('❌ Error saving course:', error);
    res.status(500).send('❌ Failed to save course.');
  }
});

// ------------------------
// DELETE COURSE
// ------------------------
router.post('/delete/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Failed to delete course');
  }
});

// ------------------------
// RENDER EDIT FORM
// ------------------------
router.get('/edit/:id', async (req, res) => {
  try {
    const mentors = await Mentor.find({});
    const course = await Course.findById(req.params.id).populate("mentor");
    const categories = ["SAP Technical", "SAP Functional", "Data Science", "Other"];
    res.render('courseUpdate', { Course: course, mentors, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Failed to load course for editing');
  }
});

// ------------------------
// UPDATE COURSE
// ------------------------
router.post('/update/:id', upload.fields([
  { name: 'courseImage', maxCount: 1 },
  { name: 'courseBannerImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const courseId = req.params.id;

    const courseImagePath = req.files?.courseImage?.[0]?.path || null;
    const courseBannerImagePath = req.files?.courseBannerImage?.[0]?.path || null;

    let cloudCourseImage = null;
    let cloudBannerImage = null;

    if (courseImagePath) {
      const result = await cloudinary.uploader.upload(courseImagePath, { folder: 'Courses' });
      cloudCourseImage = result.secure_url;
      fs.unlinkSync(courseImagePath);
    }

    if (courseBannerImagePath) {
      const result = await cloudinary.uploader.upload(courseBannerImagePath, { folder: 'Courses/Banners' });
      cloudBannerImage = result.secure_url;
      fs.unlinkSync(courseBannerImagePath);
    }

    let courseSlug = req.body.courseSlug
      ? req.body.courseSlug.trim().replace(/\s+/g, '-').toLowerCase()
      : slugify(req.body.courseTitle);

    const updateData = {
      courseTitle: req.body.courseTitle,
      courseUrl: courseSlug,
      courseBrochure: req.body.courseBrochure,
      courseDemoVideo: req.body.courseDemoVideo,
      courseDescription: req.body.courseDescription,
      courseOverview: req.body.courseOverview,
      courseDuration: req.body.courseDuration,
      courseCurriculum: req.body.courseCurriculum,
      coursePrice: {
        online: Number(req.body.coursePrice?.online || 0),
        offline: Number(req.body.coursePrice?.offline || 0)
      },
      courseDiscount: {
        online: Number(req.body.courseDiscount?.online || 0),
        offline: Number(req.body.courseDiscount?.offline || 0)
      },
      courseCategory: req.body.courseCategory,
      mentor: req.body.mentor,
      ...(cloudCourseImage && { courseImage: { cloud: cloudCourseImage, local: null } }),
      ...(cloudBannerImage && { courseBannerImage: { cloud: cloudBannerImage, local: null } })
    };

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
    if (!updatedCourse) return res.status(404).send('❌ Course not found');

    res.redirect('/');
  } catch (error) {
    console.error('❌ Error updating course:', error);
    res.status(500).send('❌ Failed to update course.');
  }
});

module.exports = router;
