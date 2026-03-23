export default function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-icon">
          <i className="fa-solid fa-heart-pulse"></i>
        </div>
        <div className="brand-text">
          <h1>693智能健康监测系统</h1>
          <p>Smart Health Monitoring & Data Analysis Platform</p>
        </div>
      </div>

      <nav className="nav">
        <a><i className="fa-solid fa-house"></i> 首页</a>
        <a><i className="fa-solid fa-pen-to-square"></i> 数据录入</a>
        <a><i className="fa-solid fa-chart-line"></i> 数据分析</a>
        <a><i className="fa-solid fa-chart-column"></i> 图表展示</a>
        <a><i className="fa-solid fa-user-shield"></i> 管理后台</a>
      </nav>
    </header>
  );
}