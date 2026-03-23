const Health = require("../models/HealthRecord");

exports.addRecord = async (req, res) => {
  const bmi = req.body.weight / ((req.body.height / 100) ** 2);

  const data = new Health({
    ...req.body,
    userId: req.user.id,
    bmi: bmi.toFixed(2)
  });

  await data.save();
  res.json(data);
};

exports.getRecords = async (req, res) => {
  const data = await Health.find({ userId: req.user.id });
  res.json(data);
};

exports.deleteRecord = async (req, res) => {
  await Health.findByIdAndDelete(req.params.id);
  res.json("deleted");
};