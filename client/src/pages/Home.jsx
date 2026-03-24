import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const demoImages = ['/img/a.jpg', '/img/b.jpg', '/img/c.jpg'];

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % demoImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

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

          <nav className="nav-bar">
            <button onClick={() => navigate('/')} className="nav-item active">
              <i className="fas fa-home"></i> 首页
            </button>
            <button onClick={() => navigate('/admin')} className="nav-item">
              <i className="fas fa-cog"></i> 管理后台
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <section className="top-banner">
            <div className="banner-card left">
              <div className="hero-inner">
                <h2>
                  面向个人健康管理的
                  <br />
                  智能监测与数据分析平台
                </h2>

                <div className="action-buttons">
                  <button onClick={() => navigate('/register')} className="btn primary">
                    <i className="fas fa-arrow-right"></i>
                    立即注册体验
                  </button>
                  <button onClick={() => navigate('/login')} className="btn secondary">
                    <i className="fas fa-user-circle"></i>
                    已有账号登录
                  </button>
                </div>

                <div className="feature-tags">
                  <span className="tag"><i className="fas fa-check"></i> 健康数据录入</span>
                  <span className="tag"><i className="fas fa-check"></i> BMI计算</span>
                  <span className="tag"><i className="fas fa-check"></i> 趋势分析</span>
                  <span className="tag"><i className="fas fa-check"></i> 健康建议</span>
                </div>
              </div>
            </div>

            <div className="banner-card right">
              <div className="hero-demo-shell">
                <div className="demo-screen">
                  {demoImages.map((src, index) => (
                    <img
                      key={src}
                      src={src}
                      alt="系统演示"
                      className={`demo-image ${index === currentIndex ? 'active' : ''}`}
                    />
                  ))}
                </div>

                <div className="demo-indicators">
                  {demoImages.map((_, idx) => (
                    <button
                      key={idx}
                      className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                    />
                  ))}
                </div>
              </div>
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
              <li>+1 800 888 8888</li>
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