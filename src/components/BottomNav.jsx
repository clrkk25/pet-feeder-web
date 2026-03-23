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
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 12px 0;
          padding-bottom: calc(12px + env(safe-area-inset-bottom));
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
          z-index: 100;
          border-top: 1px solid #e2e8f0;
          backdrop-filter: blur(10px);
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
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 70px;
          flex: 1;
          position: relative;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px 3px 0 0;
          transition: width 0.25s;
        }

        .nav-item.active {
          color: #667eea;
        }

        .nav-item.active::before {
          width: 40px;
        }

        .nav-icon {
          font-size: 24px;
          margin-bottom: 4px;
          transition: all 0.25s;
          filter: grayscale(0.3);
        }

        .nav-item.active .nav-icon {
          transform: scale(1.15) translateY(-2px);
          filter: grayscale(0);
        }

        .nav-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: #718096;
          transition: all 0.25s;
        }

        .nav-item.active .nav-label {
          color: #667eea;
          font-weight: 700;
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
