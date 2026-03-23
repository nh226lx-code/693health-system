import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const [steps, setSteps] = useState('');
  const [sleep, setSleep] = useState('');
  const [water, setWater] = useState('');
  const [weight, setWeight] = useState('');

  const healthData = {
    steps: 8240,
    sleep: 7.5,
    water: 1800,
    weight: 58,
    bmi: 0,
    healthStatus: '待分析'
  };

  const goTo = (path) => {
    navigate(path);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('请先登录');
        return;
      }

      const res = await fetch('http://localhost:5000/api/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          steps: Number(steps),
          sleep: Number(sleep),
          water: Number(water),
          weight: Number(weight)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '保存失败');
      }

      console.log(data);
      alert('保存成功');
    } catch (err) {
      console.error(err);
      alert(err.message || '保存失败');
    }
  };

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="header-content">
          <div className="logo-block">
            <div className="logo-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <div className="logo-text">
              <h1>693智能健康监测系统</h1>
              <p>Smart Health Monitoring & Data Analysis Platform</p>
            </div>
</div>

<nav className="nav-bar" style={{ display: "flex", alignItems: "center" }}>
  {/* 左侧导航 */}
  <div style={{ display: "flex", gap: "20px" }}>
    <button onClick={() => goTo('/')} className="nav-item active">
      <i className="fas fa-home"></i> 首页
    </button>

    <button onClick={() => goTo('/data-entry')} className="nav-item">
      <i className="fas fa-keyboard"></i> 健康记录
    </button>

    <button onClick={() => goTo('/analysis')} className="nav-item">
      <i className="fas fa-chart-line"></i> 数据分析
    </button>
  </div>

  {/* 右侧 登录 / 注册 */}
  <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
    <button onClick={() => goTo('/login')} className="nav-item">
      <i className="fas fa-sign-in-alt"></i> 登录
    </button>

    <button onClick={() => goTo('/register')} className="nav-item">
      <i className="fas fa-user-plus"></i> 注册
    </button>
  </div>
            
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <section className="top-banner">
            <div className="banner-card left">
              <h2>面向个人健康管理的<br />智能监测与数据分析平台</h2>
              <div className="action-buttons">
                <button onClick={() => goTo('/data-entry')} className="btn primary">
                  <span>→</span> 开始健康记录
                </button>
                <button className="btn secondary">
                  <span>ℹ</span> 查看系统功能
                </button>
              </div>
              <div className="feature-tags">
                <span className="tag"><i className="fas fa-check"></i> 健康数据录入</span>
                <span className="tag"><i className="fas fa-check"></i> BMI计算</span>
                <span className="tag"><i className="fas fa-check"></i> 趋势图分析</span>
                <span className="tag"><i className="fas fa-check"></i> 健康建议反馈</span>
              </div>
            </div>

            <div className="banner-card right">
              <div className="card-header">
                <span className="header-title"><i className="fas fa-chart-pie"></i> 今日健康总览</span>
                <span className="status-badge">系统正常</span>
              </div>
              <div className="health-grid">
                <div className="health-item">
                  <div className="item-icon green">
                    <i className="fas fa-walking"></i>
                  </div>
                  <div className="item-info">
                    <span className="info-label">步数</span>
                    <span className="info-value">{healthData.steps}</span>
                  </div>
                </div>
                <div className="health-item">
                  <div className="item-icon blue">
                    <i className="fas fa-bed"></i>
                  </div>
                  <div className="item-info">
                    <span className="info-label">睡眠</span>
                    <span className="info-value">{healthData.sleep}h</span>
                  </div>
                </div>
                <div className="health-item">
                  <div className="item-icon cyan">
                    <i className="fas fa-tint"></i>
                  </div>
                  <div className="item-info">
                    <span className="info-label">饮水</span>
                    <span className="info-value">{healthData.water}ml</span>
                  </div>
                </div>
                <div className="health-item">
                  <div className="item-icon orange">
                    <i className="fas fa-weight"></i>
                  </div>
                  <div className="item-info">
                    <span className="info-label">体重</span>
                    <span className="info-value">{healthData.weight}kg</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="content-section">
            <div className="form-card">
              <h3 className="card-title">
                <i className="fas fa-keyboard"></i> 健康数据录入
              </h3>
              <p className="card-desc">请输入今日健康信息，系统将自动更新基础指标、BMI和健康建议</p>
              <div className="input-grid">
                <div className="input-group">
                  <label>今日步数</label>
                  <input
                    type="number"
                    placeholder="请输入今日步数"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>睡眠时间（小时）</label>
                  <input
                    type="number"
                    placeholder="请输入睡眠时间"
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>饮水量（ml）</label>
                  <input
                    type="number"
                    placeholder="请输入饮水量"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>体重（kg）</label>
                  <input
                    type="number"
                    placeholder="请输入体重"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="input-group full-width">
                  <label>身高（cm）</label>
                  <input type="number" placeholder="请输入身高，用于BMI计算" />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn primary" onClick={handleSave}>
                  <i className="fas fa-save"></i> 保存健康数据
                </button>
                <button className="btn primary">
                  <i className="fas fa-sync-alt"></i> 重置输入
                </button>
              </div>
            </div>

            <div className="advice-card">
              <h3 className="card-title">
                <i className="fas fa-stethoscope"></i> 健康建议
              </h3>
              <p className="card-desc">系统将根据当前健康数据自动生成基础建议</p>
              <div className="advice-status">
                <div className="status-item">
                  <span className="info-label">BMI指数</span>
                  <span className="info-value">{healthData.bmi}</span>
                </div>
                <div className="status-item">
                  <span className="info-label">健康状态</span>
                  <span className="info-value">{healthData.healthStatus}</span>
                </div>
              </div>
              <ul className="advice-list">
                <li>• 请输入健康数据后查看系统建议。</li>
                <li>• 建议每天保持稳定运动与规律作息。</li>
                <li>• 系统会根据 BMI、步数和睡眠时间更新内容。</li>
                <li>• 请输入健康数据后查看系统建议。</li>
                <li>• 建议每天保持稳定运动与规律作息。</li>
                <li>• 系统会根据 BMI、步数和睡眠时间更新内容。</li>
              </ul>
            </div>
          </section>

          <section className="chart-card">
            <h3 className="card-title">
              <i className="fas fa-chart-line"></i> 健康趋势图
            </h3>
            <p className="card-desc">根据当前录入数据生成演示趋势图</p>
            <div className="chart-container">
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-color steps"></span> 步数</span>
                <span className="legend-item"><span className="legend-color sleep"></span> 睡眠</span>
                <span className="legend-item"><span className="legend-color water"></span> 饮水量</span>
                <span className="legend-item"><span className="legend-color weight"></span> 体重</span>
              </div>
              <svg className="trend-chart" viewBox="0 0 900 300">
                <g className="y-axis">
                  <text x="10" y="20">8,000</text>
                  <text x="10" y="50">7,000</text>
                  <text x="10" y="80">6,000</text>
                  <text x="10" y="110">5,000</text>
                  <text x="10" y="140">4,000</text>
                  <text x="10" y="170">3,000</text>
                  <text x="10" y="200">2,000</text>
                  <text x="10" y="230">1,000</text>
                  <text x="10" y="260">0</text>
                </g>
                <g className="y-axis-right">
                  <text x="880" y="20">60</text>
                  <text x="880" y="50">50</text>
                  <text x="880" y="80">40</text>
                  <text x="880" y="110">30</text>
                  <text x="880" y="140">20</text>
                  <text x="880" y="170">10</text>
                  <text x="880" y="260">0</text>
                </g>
                <g className="x-axis">
                  <text x="50" y="280">周一</text>
                  <text x="190" y="280">周二</text>
                  <text x="330" y="280">周三</text>
                  <text x="470" y="280">周四</text>
                  <text x="610" y="280">周五</text>
                  <text x="850" y="280">今日</text>
                </g>
                <g className="grid">
                  <line x1="50" y1="20" x2="850" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="50" x2="850" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="80" x2="850" y2="80" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="110" x2="850" y2="110" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="140" x2="850" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="170" x2="850" y2="170" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="200" x2="850" y2="200" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="230" x2="850" y2="230" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="260" x2="850" y2="260" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="50" y1="260" x2="850" y2="260" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="50" y1="20" x2="50" y2="260" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="190" y1="20" x2="190" y2="260" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="330" y1="20" x2="330" y2="260" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="470" y1="20" x2="470" y2="260" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="610" y1="20" x2="610" y2="260" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="850" y1="20" x2="850" y2="260" stroke="#e5e7eb" strokeWidth="1" />
                </g>
                <path d="M 50 110 Q 120 80, 190 60 Q 260 40, 330 45 Q 400 50, 470 80 Q 540 110, 610 30 Q 680 10, 850 260" stroke="#38bdf8" strokeWidth="3" fill="none" />
                <circle cx="50" cy="110" r="3" fill="#38bdf8" />
                <circle cx="190" cy="60" r="3" fill="#38bdf8" />
                <circle cx="330" cy="45" r="3" fill="#38bdf8" />
                <circle cx="470" cy="80" r="3" fill="#38bdf8" />
                <circle cx="610" cy="30" r="3" fill="#38bdf8" />
                <circle cx="850" cy="260" r="3" fill="#38bdf8" />

                <path d="M 50 240 Q 120 238, 190 235 Q 260 236, 330 237 Q 400 238, 470 236 Q 540 237, 610 238 Q 680 240, 850 260" stroke="#fb7185" strokeWidth="3" fill="none" />
                <circle cx="50" cy="240" r="3" fill="#fb7185" />
                <circle cx="190" cy="235" r="3" fill="#fb7185" />
                <circle cx="330" cy="237" r="3" fill="#fb7185" />
                <circle cx="470" cy="236" r="3" fill="#fb7185" />
                <circle cx="610" cy="238" r="3" fill="#fb7185" />
                <circle cx="850" cy="260" r="3" fill="#fb7185" />

                <path d="M 50 220 Q 120 218, 190 217 Q 260 215, 330 216 Q 400 217, 470 218 Q 540 216, 610 210 Q 680 215, 850 260" stroke="#fb923c" strokeWidth="3" fill="none" />
                <circle cx="50" cy="220" r="3" fill="#fb923c" />
                <circle cx="190" cy="217" r="3" fill="#fb923c" />
                <circle cx="330" cy="216" r="3" fill="#fb923c" />
                <circle cx="470" cy="218" r="3" fill="#fb923c" />
                <circle cx="610" cy="210" r="3" fill="#fb923c" />
                <circle cx="850" cy="260" r="3" fill="#fb923c" />

                <path d="M 50 20 Q 120 20, 190 20 Q 260 20, 330 20 Q 400 20, 470 20 Q 540 20, 610 20 Q 680 30, 850 260" stroke="#fbbf24" strokeWidth="3" fill="none" />
                <circle cx="50" cy="20" r="3" fill="#fbbf24" />
                <circle cx="190" cy="20" r="3" fill="#fbbf24" />
                <circle cx="330" cy="20" r="3" fill="#fbbf24" />
                <circle cx="470" cy="20" r="3" fill="#fbbf24" />
                <circle cx="610" cy="20" r="3" fill="#fbbf24" />
                <circle cx="850" cy="260" r="3" fill="#fbbf24" />
              </svg>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>HealthTrack</h4>
            <p>智能健康监测与数据分析平台，帮助用户持续跟踪健康指标，实现科学化健康管理。</p>
          </div>
          <div className="footer-col">
            <h4>产品功能</h4>
            <ul>
              <li>健康记录</li>
              <li>健康趋势分析</li>
              <li>数据图表展示</li>
              <li>健康建议系统</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>平台服务</h4>
            <ul>
              <li>用户中心</li>
              <li>健康报告</li>
              <li>数据管理</li>
              <li>系统设置</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>联系我们</h4>
            <ul>
              <li>support@healthtrack.com</li>
              <li>+ 1 800 888 8888</li>
              <li>California, USA</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 HealthTrack Health Management Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;