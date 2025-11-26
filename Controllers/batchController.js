const Batch = require('../Models/batchModel');

// Show all batches
exports.showAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.render("batchView", { batches });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching batches");
  }
};

// Show Add Batch Form
exports.renderAddBatchForm = (req, res) => {
  res.render("batchAdd");
};

// Handle Add Batch
exports.addBatch = async (req, res) => {
  try {
    const { course, startDate, days, time } = req.body;
    await Batch.create({ course, startDate, days, time });
    res.redirect("/batch");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving batch");
  }
};

// Show Edit Batch Form
exports.renderEditBatchForm = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).send("Batch not found");
    res.render("batchEdit", { batch });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading batch");
  }
};

// Handle Edit Batch
exports.editBatch = async (req, res) => {
  try {
    const { course, startDate, days, time } = req.body;
    await Batch.findByIdAndUpdate(req.params.id, { course, startDate, days, time });
    res.redirect("/batch");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating batch");
  }
};

// Delete Batch
exports.deleteBatch = async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.redirect("/batch");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting batch");
  }
};
