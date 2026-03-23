const User = require("../models/User");
const HealthRecord = require("../models/HealthRecord");

exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecords = await HealthRecord.countDocuments();

    res.json({
      totalUsers,
      totalRecords
    });
  } catch (err) {
    res.status(500).json("overview error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json("users error");
  }
};

exports.getRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find().sort({ _id: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json("records error");
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    await HealthRecord.findByIdAndDelete(req.params.id);
    res.json("删除成功");
  } catch (err) {
    res.status(500).json("delete error");
  }
};