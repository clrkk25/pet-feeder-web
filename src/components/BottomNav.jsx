function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">首页</span>
      </button>
      <button 
        className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => onTabChange('history')}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-label">记录</span>
      </button>
      <button 
        className={`nav-item ${activeTab === 'camera' ? 'active' : ''}`}
        onClick={() => onTabChange('camera')}
      >
        <span className="nav-icon">📷</span>
        <span className="nav-label">摄像头</span>
      </button>

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 0;
          padding-bottom: calc(8px + env(safe-area-inset-bottom));
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          z-index: 100;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 80px;
        }

        .nav-item.active {
          color: #667eea;
        }

        .nav-icon {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .nav-label {
          font-size: 12px;
          font-weight: 500;
        }

        @media (min-width: 481px) {
          .bottom-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  )
}

export default BottomNav
