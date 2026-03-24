const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

let healthData = []

app.post("/api/auth/login", (req, res) => {
  res.json({ token: "ok", role: "user" })
})

app.post("/api/health", (req, res) => {
  const date =
    req.body.date ||
    req.body.recordDate ||
    new Date().toISOString().split("T")[0]

  const exists = healthData.find(item => item.date === date)

  if (exists) {
    return res.status(400).json({ message: "already submitted" })
  }

  const data = {
    ...req.body,
    date
  }

  healthData.push(data)

  res.json({ message: "saved" })
})

app.get("/api/health", (req, res) => {
  const sortedData = [...healthData].sort((a, b) => new Date(b.date) - new Date(a.date))
  res.json(sortedData)
})

app.use(express.static(path.join(__dirname, "../client/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
})

const PORT = process.env.PORT || 5000

app.listen(PORT)