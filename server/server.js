const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* ===== 中间件 ===== */
app.use(cors());
app.use(express.json());

/* ===== 路由引入 ===== */
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');

/* ===== 路由挂载（关键）===== */
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

/* ===== 测试接口 ===== */
app.get('/', (req, res) => {
  res.send('Server is running');
});

/* ===== 数据库连接 ===== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

/* ===== 启动服务器 ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});