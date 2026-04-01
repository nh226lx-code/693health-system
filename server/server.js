const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const XLSX = require("xlsx");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
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

const clean = (val) => {
  let v = String(val || "").trim();
  v = v.replace(/-token$/i, "");
  v = v.replace(/^"+|"+$/g, "").trim();
  v = v.replace(/[\u0000-\u001f]/g, "").trim();
  if (v.includes(",")) v = v.split(",")[0].trim();
  if (v.includes("PK")) return "";
  if (/[^\x20-\x7E]/.test(v)) return "";
  return v;
};

const fixData = async () => {
  const users = await User.find();
  for (let u of users) {
    const email = clean(u.email);
    if (!email) {
      await User.findByIdAndDelete(u._id);
      continue;
    }
    if (u.email !== email) {
      u.email = email;
      u.username = email.split("@")[0];
      await u.save();
    }
  }

  const records = await Health.find();
  for (let r of records) {
    const email = clean(r.user);
    if (!email) {
      await Health.findByIdAndDelete(r._id);
      continue;
    }
    if (r.user !== email) {
      r.user = email;
      await r.save();
    }
  }

  console.log("数据清洗完成");
};

mongoose.connection.once("open", async () => {
  await fixData();
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = clean(req.body.email);
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({});

    let ok = false;

    if (user.password && user.password.startsWith("$2")) {
      ok = await bcrypt.compare(password, user.password);
    } else {
      ok = password === user.password;
    }

    if (!ok) return res.status(400).json({});

    const role = user.role === "admin" ? "admin" : "user";

    res.json({
      token: role === "admin" ? "admin-token" : email + "-token",
      role,
      userId: email
    });
  } catch {
    res.json({});
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const cleanUsers = users.filter(
      (u) => u.email && !u.email.includes("PK") && !/[^\x20-\x7E]/.test(u.email)
    );
    res.json(cleanUsers);
  } catch {
    res.json([]);
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const email = clean(req.body.email);
    if (!email) return res.json({});

    const exist = await User.findOne({ email });
    if (exist) return res.json(exist);

    const user = await User.create({
      email,
      username: email.split("@")[0],
      password: await bcrypt.hash("123456", 10),
      role: "user"
    });

    res.json(user);
  } catch {
    res.json({});
  }
});

app.post("/api/admin/import-users", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.json({ message: "没有文件" });
    }

    const file = req.files.file;
    let data = [];

    if (file.name.endsWith(".csv")) {
      const content = file.data.toString("utf8");
      const lines = content.split("\n");

for (let i = 1; i < lines.length; i++) {
  let line = lines[i].trim();
  if (!line) continue;

  const cols = line.split(",");

  const email = clean(cols[1]);

  if (!email) continue;

  data.push({ email });
}
    } else {
      const workbook = XLSX.read(file.data, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(sheet);
    }

let count = 0;

for (let row of data) {
  const email = clean(row.email);

  if (!email) continue;

  const exist = await User.findOne({ email });

  if (!exist) {
    await User.create({
      email,
      username: email.split("@")[0],
      password: await bcrypt.hash("123456", 10),
      role: "user"
    });
  }

  count++;
}


res.json({ message: `导入成功 ${count} 条` });
  } catch {
    res.json({ message: "导入失败" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) await Health.deleteMany({ user: user.email });
    res.json({});
  } catch {
    res.json({});
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const data = await Health.find().sort({ date: -1 });
    res.json(data);
  } catch {
    res.json([]);
  }
});

app.post("/api/health", async (req, res) => {
  try {
    const email = clean(req.body.user);
    if (!email) return res.json({});

const date = req.body.date || new Date().toISOString();

    const exist = await User.findOne({ email });
    if (!exist) {
      await User.create({
        email,
        username: email.split("@")[0],
        password: await bcrypt.hash("123456", 10),
        role: "user"
      });
    }

const safeEmail = clean(email);

await Health.create({
  user: safeEmail,
      date,
      steps: Number(req.body.steps) || 0,
      sleep: Number(req.body.sleep) || 0,
      water: Number(req.body.water) || 0,
      weight: Number(req.body.weight) || 0
    });

    res.json({});
  } catch {
    res.json({});
  }
});

app.post("/api/admin/import-records", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.json({ message: "没有文件" });
    }

    const file = req.files.file;
    const workbook = XLSX.read(file.data, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    let addedUsers = 0;
    let addedRecords = 0;
    let updatedRecords = 0;

    for (const row of data) {
      const email = clean(row["邮箱"] || row.email);
      const username =
        clean(row["用户名"] || row.username) || (email ? email.split("@")[0] : "");

      const rawDate = String(row["日期"] || row.date || "").trim();
      const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
        ? rawDate
        : new Date().toISOString().slice(0, 10);

      if (!email) continue;

      const existUser = await User.findOne({ email });
      if (!existUser) {
        await User.create({
          email,
          username,
          password: await bcrypt.hash("123456", 10),
          role: "user"
        });
        addedUsers++;
      }

      const existRecord = await Health.findOne({ user: email, date });

      if (existRecord) {
        existRecord.steps = Number(row["步数"] || 0);
        existRecord.sleep = Number(row["睡眠"] || 0);
        existRecord.water = Number(row["饮水"] || 0);
        existRecord.weight = Number(row["体重"] || 0);
        await existRecord.save();
        updatedRecords++;
      } else {
        await Health.create({
          user: email,
          date,
          steps: Number(row["步数"] || 0),
          sleep: Number(row["睡眠"] || 0),
          water: Number(row["饮水"] || 0),
          weight: Number(row["体重"] || 0)
        });
        addedRecords++;
      }
    }

    return res.json({
      message: `新增用户 ${addedUsers} 人，新增报告 ${addedRecords} 条，更新报告 ${updatedRecords} 条`
    });
  } catch (err) {
    console.log("import-records error:", err);
    return res.json({ message: "导入失败" });
  }
});
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api")) return res.status(404).end();
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(process.env.PORT || 5000);