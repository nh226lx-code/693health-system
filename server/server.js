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
    console.log("USING URI:", process.env.MONGO_URI);
  })
  .catch(err => console.log(err));

const HealthSchema = new mongoose.Schema({
  date: String,
  user: String,
  steps: Number,
  sleep: Number,
  water: Number,
  weight: Number
});

const Health = mongoose.model("Health", HealthSchema);

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String
});

const User = mongoose.model("User", UserSchema);

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const account = email || username || "";

    if (!account || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: account });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    return res.json({
      token: account + "-token",
      role: user.role || "user",
      userId: account
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || "user"
    });

    res.json({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/health", async (req, res) => {
  try {
    const date = new Date(
      req.body.date || req.body.recordDate || new Date()
    ).toISOString().slice(0, 10);

    const token = req.headers.authorization?.split(" ")[1] || "unknown";

    const newData = {
      date,
      user: token,
      steps: Number(req.body.steps) || 0,
      sleep: Number(req.body.sleep) || 0,
      water: Number(req.body.water) || 0,
      weight: Number(req.body.weight) || 0
    };

    await Health.findOneAndUpdate(
      { date, user: token },
      newData,
      { upsert: true, new: true }
    );

    res.json({ message: "saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const data = await Health.find({ user: token }).sort({ date: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});