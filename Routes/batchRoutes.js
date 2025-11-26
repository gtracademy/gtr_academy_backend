const express = require('express');
const router = express.Router();
const adminAuth = require('../Middlewares/authMiddleware');
const batchController = require('../controllers/batchController');

// Show all batches
router.get("/", adminAuth, batchController.showAllBatches);

// Show Add Batch Form
router.get("/add", adminAuth, batchController.renderAddBatchForm);

// Handle Add Batch
router.post("/add", adminAuth, batchController.addBatch);

// Show Edit Batch Form
router.get("/edit/:id", adminAuth, batchController.renderEditBatchForm);

// Handle Edit Batch
router.post("/edit/:id", adminAuth, batchController.editBatch);

// Delete Batch
router.post("/delete/:id", adminAuth, batchController.deleteBatch);

module.exports = router;
