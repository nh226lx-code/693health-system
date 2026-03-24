const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

let healthData = []

app.post("/api/auth/login", (req, res) => {
  const { username } = req.body

  if (username === "admin") {
    res.json({ token: "ok", role: "admin" })
  } else {
    res.json({ token: "ok", role: "user" })
  }
})

app.post("/api/health", (req, res) => {
  const date =
    req.body.date ||
    req.body.recordDate ||
    new Date().toISOString().slice(0, 10)

  const index = healthData.findIndex((item) => item.date === date)

  const newData = { ...req.body, date }

  if (index !== -1) {
    healthData[index] = newData
  } else {
    healthData.push(newData)
  }

  healthData.sort((a, b) => {
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1
    return 0
  })

  res.json({ message: "saved" })
})

app.get("/api/health", (req, res) => {
  res.json(healthData)
})

app.use(express.static(path.join(__dirname, "../client/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
})

const PORT = process.env.PORT || 5000

app.listen(PORT)