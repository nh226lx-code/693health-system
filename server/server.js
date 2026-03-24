const express = require("express")
const cors = require("cors")
const path = require("path")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err))


const HealthSchema = new mongoose.Schema({
  date: String,
  steps: Number,
  sleep: Number,
  water: Number,
  weight: Number
})

const Health = mongoose.model("Health", HealthSchema)


app.post("/api/auth/login", (req, res) => {
  const { username, email, password } = req.body

  const account = username || email || ""

  if (account === "test@admin.com" && password === "123456") {
    return res.json({ token: "ok", role: "admin" })
  }

  return res.json({ token: "ok", role: "user" })
})


app.post("/api/health", async (req, res) => {
  const date = new Date(
    req.body.date || req.body.recordDate || new Date()
  ).toISOString().slice(0, 10);

  const newData = {
    date,
    steps: Number(req.body.steps) || 0,
    sleep: Number(req.body.sleep) || 0,
    water: Number(req.body.water) || 0,
    weight: Number(req.body.weight) || 0,
  };

  await Health.findOneAndUpdate(
    { date },
    newData,
    { upsert: true, new: true }
  );

  res.json({ message: "saved" });
});


app.get("/api/health", async (req, res) => {
  const data = await Health.find().sort({ date: -1 })
  res.json(data)
})

// ================= 前端 =================
app.use(express.static(path.join(__dirname, "../client/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})