const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: { type: Date, default: Date.now },
  steps: Number,
  sleepHours: Number,
  waterIntake: Number,
  weight: Number,
  height: Number,
  bmi: Number
});

module.exports = mongoose.model("HealthRecord", healthSchema);