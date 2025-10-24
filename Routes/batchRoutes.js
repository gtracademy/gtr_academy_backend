const express = require('express');
const Batch = require('../Models/batchModel');
const router = express.Router();
const adminAuth = require('../Middlewares/authMiddleware')

// Show all batches
router.get("/", adminAuth, async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.render("batchView", { batches });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching batches");
  }
});

// Add Batch Form
router.get("/add", adminAuth, (req, res) => {
  res.render("batchAdd");
});

// Handle Add Batch
router.post("/add", adminAuth, async (req, res) => {
  try {
    const { course, startDate, days, time } = req.body;
    await Batch.create({ course, startDate, days, time });
    res.redirect("/batch");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving batch");
  }
});

// Edit Batch Form
router.get("/edit/:id", adminAuth,async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).send("Batch not found");
    res.render("batchEdit", { batch });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading batch");
  }
});

// Handle Edit Batch
router.post("/edit/:id", adminAuth, async (req, res) => {
  try {
    const { course, startDate, days, time } = req.body;
    await Batch.findByIdAndUpdate(req.params.id, { course, startDate, days, time });
    res.redirect("/batch");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating batch");
  }
});

// Delete Batch
router.post("/delete/:id", adminAuth, async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.redirect("/batch");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting batch");
  }
});

module.exports = router;
