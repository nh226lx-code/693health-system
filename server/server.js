const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

const HealthSchema = new mongoose.Schema({
  date: String,
  user: String,
  steps: Number,
  sleep: Number,
  water: Number,
  weight: Number
});

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String
});

const Health = mongoose.models.Health || mongoose.model("Health", HealthSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "请输入邮箱和密码" });
    }

    const users = await User.find({ email });

    if (!users || users.length === 0) {
      return res.status(400).json({ message: "用户不存在" });
    }

    let matchedUser = null;

    for (const user of users) {
      let isMatch = false;

      if (user.password) {
        try {
          if (user.password.startsWith("$2")) {
            isMatch = await bcrypt.compare(password, user.password);
          } else {
            isMatch = password === user.password;
          }
        } catch {
          isMatch = false;
        }

        if (!isMatch && password === user.password) {
          isMatch = true;
        }
      }

      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(400).json({ message: "密码错误" });
    }

    const role = email === "test@admin.com" ? "admin" : (matchedUser.role || "user");
    const token = role === "admin" ? "admin-token" : email + "-token";

    return res.json({
      token,
      role,
      userId: email
    });
  } catch {
    return res.status(500).json({ message: "服务器错误" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.json([]);
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.json({ message: "fail" });
    }

app.post("/api/users", async (req, res) => {
  try {
    const { email, password, role, username } = req.body;

    if (!email) {
      return res.json({ message: "fail" });
    }

    const hash = await bcrypt.hash(password || "123456", 10);

    const newUser = await User.findOneAndUpdate(
      { email },
      {
        email,
        username: username || email.split("@")[0],
        password: hash,
        role: role || "user"
      },
      { upsert: true, new: true }
    );

    res.json({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role
    });
  } catch {
    res.json({ message: "error" });
  }
});

    const hash = await bcrypt.hash(password, 10);
    const savedRole = email === "test@admin.com" ? "admin" : (role || "user");

    const newUser = await User.create({
      email,
      password: hash,
      role: savedRole
    });

    res.json({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role
    });
  } catch {
    res.json({ message: "error" });
  }
});

/* ===== 修复这里：导入数据写入问题 ===== */
app.post("/api/health", async (req, res) => {
  try {
    const date = new Date(
      req.body.date || req.body.recordDate || new Date()
    ).toISOString().slice(0, 10);

    const user = req.body.user || "unknown";

    const data = {
      date,
      user,
      steps: Number(req.body.steps) || 0,
      sleep: Number(req.body.sleep) || 0,
      water: Number(req.body.water) || 0,
      weight: Number(req.body.weight) || 0
    };

    await Health.findOneAndUpdate(
      { date, user },
      data,
      { upsert: true, new: true }
    );

    res.json({ message: "ok" });
  } catch {
    res.json({ message: "error" });
  }
});

/* ===== 修复这里：管理员能看到导入数据 ===== */
app.get("/api/health", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";

    if (token === "admin-token") {
      const data = await Health.find().sort({ date: -1 });
      return res.json(data);
    }

    const data = await Health.find({ user: token }).sort({ date: -1 });
    res.json(data);
  } catch {
    res.json([]);
  }
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});