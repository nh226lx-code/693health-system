const Health = require("../models/HealthRecord");

exports.summary = async (req, res) => {
  const data = await Health.find({ userId: req.user.id });

  const avg = (key) =>
    data.reduce((a, b) => a + (b[key] || 0), 0) / data.length || 0;

  res.json({
    avgSteps: avg("steps"),
    avgSleep: avg("sleepHours"),
    avgWater: avg("waterIntake")
  });
};