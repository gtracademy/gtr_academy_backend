const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  course: { type: String, required: true },
  startDate: { type: String, required: true },
  days: { type: String, required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model("Batch", batchSchema);
