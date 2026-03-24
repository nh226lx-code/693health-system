app.post("/api/auth/login", (req, res) => {
  const { email } = req.body

  let role = "user"

  if (email === "admin@test.com") {
    role = "admin"
  }

  res.json({
    token: "ok",
    role
  })
})