const fs = require('fs');
const path = require('path');
const Course = require('../Models/courseModel');
const Mentor = require('../Models/mentorModel');
const { uploadToCloudinary } = require('../Config/Cloudinary'); // ⬅ Cloudinary Helper

// Helper function: slugify
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// ------------------------
// RENDER ADD COURSE FORM
// ------------------------
exports.renderAddCourseForm = async (req, res) => {
  const mentors = await Mentor.find({});
  const categories = ['SAP', 'Data', 'Other'];
  res.render('courseAdd', { mentors, categories });
};

// ------------------------
// ADD COURSE
// ------------------------
exports.addCourse = async (req, res) => {
  try {
    // Uploaded local file paths
    const courseImagePath = req.files?.courseImage?.[0]?.path || null;
    const courseBannerImagePath = req.files?.courseBannerImage?.[0]?.path || null;
    const brochurePath = req.files?.courseBrochure?.[0]?.path || null;

    let cloudCourseImage = null;
    let cloudBannerImage = null;
    let cloudBrochure = null;

    // Upload to Cloudinary (via helper)
    if (courseImagePath) {
      cloudCourseImage = await uploadToCloudinary(courseImagePath, 'Courses');
      fs.unlinkSync(courseImagePath);
    }

    if (courseBannerImagePath) {
      cloudBannerImage = await uploadToCloudinary(courseBannerImagePath, 'Courses/Banners');
      fs.unlinkSync(courseBannerImagePath);
    }

    if (brochurePath) {
      cloudBrochure = await uploadToCloudinary(brochurePath, 'Courses/Brochures');
      fs.unlinkSync(brochurePath);
    }

    // Category handling
    let finalCategory = req.body.courseCategory;
    if (finalCategory === 'Other' && req.body.customCategory) {
      finalCategory = req.body.customCategory.trim();
    }

    // Price & Discount
    const onlinePrice = Number(req.body.coursePrice?.online || 0);
    const offlinePrice = Number(req.body.coursePrice?.offline || 0);
    const onlineDiscount = Number(req.body.courseDiscount?.online || 0);
    const offlineDiscount = Number(req.body.courseDiscount?.offline || 0);

    // Course Slug
    let courseSlug = req.body.courseSlug?.trim();
    if (!courseSlug) courseSlug = slugify(req.body.courseTitle);
    courseSlug += '-' + Date.now();

    // Curriculum parsing
    let parsedCurriculum = [];
    if (req.body.courseCurriculum) {
      const data = req.body.courseCurriculum;
      parsedCurriculum = Array.isArray(data)
        ? data.map((item) => ({ title: item.title, details: item.details }))
        : [{ title: data.title, details: data.details }];
    }

    // Create new Course Document
    const newCourse = new Course({
      courseTitle: req.body.courseTitle,
      courseKeyword: req.body.courseKeyword,
      courseUrl: courseSlug,
      courseBrochure: cloudBrochure,
      courseDemoVideo: req.body.courseDemoVideo,
      courseDescription: req.body.courseDescription,
      courseOverview: req.body.courseOverview,
      courseDuration: req.body.courseDuration,
      courseCurriculum: parsedCurriculum,
      coursePrice: { online: onlinePrice, offline: offlinePrice },
      courseDiscount: { online: onlineDiscount, offline: offlineDiscount },
      razorpayURL: {
        online: String(req.body.razorpayURL?.online),
        offline: String(req.body.razorpayURL?.offline)
      },
      courseCategory: finalCategory,
      courseImage: { cloud: cloudCourseImage, local: null },
      courseBannerImage: { cloud: cloudBannerImage, local: null },
      mentor: req.body.mentor
    });

    await newCourse.save();
    res.redirect('/');
  } catch (error) {
    console.error('❌ Error saving course:', error);
    res.status(500).send('❌ Failed to save course.');
  }
};

// ------------------------
// DELETE COURSE
// ------------------------
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Failed to delete course');
  }
};

// ------------------------
// RENDER EDIT FORM
// ------------------------
exports.renderEditCourseForm = async (req, res) => {
  try {
    const mentors = await Mentor.find({});
    const course = await Course.findById(req.params.id).populate('mentor');
    const categories = ['SAP Technical', 'SAP Functional', 'Data Science', 'Other'];

    res.render('courseUpdate', { Course: course, mentors, categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Failed to load course for editing');
  }
};

// ------------------------
// UPDATE COURSE
// ------------------------
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const courseImagePath = req.files?.courseImage?.[0]?.path || null;
    const courseBannerImagePath = req.files?.courseBannerImage?.[0]?.path || null;
    const brochurePath = req.files?.courseBrochure?.[0]?.path || null;

    let cloudCourseImage = null;
    let cloudBannerImage = null;
    let cloudBrochure = null;

    if (courseImagePath) {
      cloudCourseImage = await uploadToCloudinary(courseImagePath, 'Courses');
      fs.unlinkSync(courseImagePath);
    }

    if (courseBannerImagePath) {
      cloudBannerImage = await uploadToCloudinary(courseBannerImagePath, 'Courses/Banners');
      fs.unlinkSync(courseBannerImagePath);
    }

    if (brochurePath) {
      cloudBrochure = await uploadToCloudinary(brochurePath, 'Courses/Brochures');
      fs.unlinkSync(brochurePath);
    }

    let courseSlug = req.body.courseSlug
      ? req.body.courseSlug.trim().replace(/\s+/g, '-').toLowerCase()
      : slugify(req.body.courseTitle);

    const updateData = {
      courseTitle: req.body.courseTitle,
      courseKeyword: req.body.courseKeyword,
      courseUrl: courseSlug,
      courseBrochure: cloudBrochure || req.body.courseBrochure,
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
      razorpayURL: {
        online: String(req.body.razorpayURL?.online),
        offline: String(req.body.razorpayURL?.offline)
      },
      courseCategory: req.body.courseCategory,
      mentor: req.body.mentor
    };

    if (cloudCourseImage) updateData.courseImage = { cloud: cloudCourseImage, local: null };
    if (cloudBannerImage) updateData.courseBannerImage = { cloud: cloudBannerImage, local: null };

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
    if (!updatedCourse) return res.status(404).send('❌ Course not found');

    res.redirect('/');
  } catch (error) {
    console.error('❌ Error updating course:', error);
    res.status(500).send('❌ Failed to update course.');
  }
};
