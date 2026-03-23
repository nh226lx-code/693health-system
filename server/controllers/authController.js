const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("missing fields");
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json("user exists");
    }

    const hash = await bcrypt.hash(password, 10);

    const role = email === "admin@test.com" ? "admin" : "user";

    const user = new User({
      email,
      password: hash,
      role
    });

    await user.save();

    res.json("注册成功");
  } catch (err) {
    res.status(500).json("注册失败");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("用户不存在");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json("密码错误");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      role: user.role
    });
  } catch (err) {
    res.status(500).json("登录失败");
  }
};