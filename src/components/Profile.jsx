import { useState, useEffect } from 'react'
import { authService, deviceService } from '../services/supabase'

function Profile({ user, device, logs, onLogout }) {
  const [isEditing, setIsEditing] = useState(false)
  const [deviceName, setDeviceName] = useState(device?.device_name || '')
  const [showAgreement, setShowAgreement] = useState(false)
  const [stats, setStats] = useState({
    totalFeeds: 0,
    totalGrams: 0,
    usageDays: 0
  })

  useEffect(() => {
    if (logs && logs.length > 0) {
      const totalFeeds = logs.length
      const totalGrams = logs.reduce((sum, log) => sum + (parseFloat(log.grams) || 0), 0)
      
      const firstLog = logs[logs.length - 1]
      let usageDays = 0
      if (firstLog?.feed_time) {
        const firstDate = new Date(firstLog.feed_time)
        const today = new Date()
        usageDays = Math.ceil((today - firstDate) / (1000 * 60 * 60 * 24))
      }
      
      setStats({
        totalFeeds,
        totalGrams: totalGrams.toFixed(1),
        usageDays
      })
    }
  }, [logs])

  const handleUpdateDeviceName = async () => {
    if (!device) return
    try {
      await deviceService.updateDevice(device.id, { device_name: deviceName })
      setIsEditing(false)
    } catch (error) {
      console.error('更新设备名称失败:', error)
      alert('更新失败，请重试')
    }
  }

  const handleCancel = () => {
    setDeviceName(device?.device_name || '')
    setIsEditing(false)
  }

  const handleAboutUs = () => {
    window.open('https://github.com/clrkk25/pet-feeder-web', '_blank')
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="user-avatar">
          <span>👤</span>
        </div>
        <div className="user-info">
          <h2 className="user-name">{user?.email?.split('@')[0] || '用户'}</h2>
          <p className="user-email">{user?.email}</p>
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">我的设备</h3>
        {device ? (
          <div className="device-card">
            <div className="device-icon">🤖</div>
            <div className="device-info">
              {isEditing ? (
                <div className="edit-device-name">
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="设备名称"
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleUpdateDeviceName}>✓</button>
                    <button className="btn-cancel" onClick={handleCancel}>✕</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="device-name">{device.device_name || '未命名设备'}</div>
                  <div className="device-mac">{device.device_mac}</div>
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>
                    ✏️ 编辑
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="no-device">
            <div className="no-device-icon">📦</div>
            <p>暂无设备</p>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3 className="section-title">数据统计</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalFeeds}</div>
            <div className="stat-label">总喂食次数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalGrams}</div>
            <div className="stat-label">总消耗粮食(g)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.usageDays}</div>
            <div className="stat-label">使用天数</div>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">快捷功能</h3>
        <div className="quick-actions">
          <div className="quick-action-item" onClick={() => alert('清理记录功能开发中...')}>
            <div className="quick-action-icon">🗑️</div>
            <div className="quick-action-label">清理记录</div>
          </div>
          <div className="quick-action-item" onClick={() => alert('导出数据功能开发中...')}>
            <div className="quick-action-icon">📊</div>
            <div className="quick-action-label">导出数据</div>
          </div>
          <div className="quick-action-item" onClick={() => alert('设备诊断功能开发中...')}>
            <div className="quick-action-icon">🔧</div>
            <div className="quick-action-label">设备诊断</div>
          </div>
          <div className="quick-action-item" onClick={() => alert('帮助中心功能开发中...')}>
            <div className="quick-action-icon">❓</div>
            <div className="quick-action-label">帮助中心</div>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <div className="settings-list">
          <div className="setting-item" onClick={handleAboutUs}>
            <div className="setting-left">
              <span className="setting-icon">ℹ️</span>
              <span className="setting-label">关于我们</span>
            </div>
            <span className="setting-arrow">›</span>
          </div>
          <div className="setting-item" onClick={() => setShowAgreement(true)}>
            <div className="setting-left">
              <span className="setting-icon">📝</span>
              <span className="setting-label">用户协议</span>
            </div>
            <span className="setting-arrow">›</span>
          </div>
        </div>
      </div>

      {showAgreement && (
        <div className="agreement-overlay">
          <div className="agreement-content">
            <div className="agreement-header">
              <h2>用户使用协议</h2>
              <button className="close-btn" onClick={() => setShowAgreement(false)}>✕</button>
            </div>
            <div className="agreement-body">
              <h3>一、服务条款</h3>
              <p>欢迎使用智能宠物喂食器应用（以下简称"本应用"）。在使用本应用前，请您仔细阅读并充分理解本协议的全部内容。</p>
              
              <h3>二、服务内容</h3>
              <p>本应用为用户提供智能宠物喂食器远程控制服务，包括但不限于：</p>
              <ul>
                <li>远程控制喂食器进行喂食</li>
                <li>设置定时喂食计划</li>
                <li>查看喂食记录和统计数据</li>
                <li>实时监控食物余量</li>
                <li>摄像头画面查看</li>
              </ul>

              <h3>三、用户账户</h3>
              <p>1. 用户需要注册账户才能使用本应用的完整功能。</p>
              <p>2. 用户应妥善保管账户信息，因账户泄露导致的损失由用户自行承担。</p>
              <p>3. 用户不得将账户转让、出借给他人使用。</p>

              <h3>四、使用规范</h3>
              <p>用户在使用本应用时，应遵守以下规范：</p>
              <ul>
                <li>不得利用本应用从事违法活动</li>
                <li>不得干扰本应用的正常运行</li>
                <li>不得尝试破解、反编译本应用</li>
                <li>不得传播病毒、木马等恶意程序</li>
              </ul>

              <h3>五、隐私保护</h3>
              <p>我们重视用户隐私保护，具体内容请参阅我们的隐私政策。我们会采取合理的安全措施保护您的个人信息。</p>

              <h3>六、免责声明</h3>
              <p>1. 本应用仅作为宠物喂食辅助工具，不能完全替代人工照料。</p>
              <p>2. 因网络故障、设备故障等原因导致的服务中断，我们不承担责任。</p>
              <p>3. 用户因使用本应用造成的任何损失，我们不承担赔偿责任。</p>

              <h3>七、知识产权</h3>
              <p>本应用的所有内容，包括但不限于文字、图片、软件、界面设计等，均受知识产权法律保护。未经授权，用户不得复制、修改、传播上述内容。</p>

              <h3>八、协议修改</h3>
              <p>我们有权随时修改本协议，修改后的协议将在应用内公布。继续使用本应用即表示您接受修改后的协议。</p>

              <h3>九、联系我们</h3>
              <p>如有任何问题或建议，请通过以下方式联系我们：</p>
              <p>GitHub: https://github.com/yourusername</p>

              <h3>十、法律适用</h3>
              <p>本协议受中华人民共和国法律管辖，因本协议引起的争议应提交至有管辖权的人民法院解决。</p>

              <div className="agreement-footer">
                <p>更新日期：2026年3月24日</p>
                <p>生效日期：2026年3月24日</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="profile-section">
        <button className="logout-button" onClick={onLogout}>
          <span className="logout-icon">🚪</span>
          退出登录
        </button>
      </div>

      <div className="version-info">
        <p>Version 1.0.0</p>
        <p>© 2026 智能宠物喂食器</p>
      </div>

      <style jsx>{`
        .profile-page {
          max-width: 500px;
          margin: 0 auto;
          background: #f0f2f5;
          padding-bottom: 80px;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px 30px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .user-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          color: white;
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 6px 0;
        }

        .user-email {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          margin: 0;
        }

        .profile-section {
          margin: 16px;
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: #718096;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .device-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .device-icon {
          font-size: 40px;
        }

        .device-info {
          flex: 1;
        }

        .device-name {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .device-mac {
          font-size: 13px;
          color: #718096;
          font-family: monospace;
          margin-bottom: 8px;
        }

        .btn-edit {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-edit:active {
          transform: scale(0.95);
        }

        .edit-device-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .edit-device-name input {
          flex: 1;
          padding: 8px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .edit-device-name input:focus {
          outline: none;
          border-color: #667eea;
        }

        .edit-actions {
          display: flex;
          gap: 6px;
        }

        .btn-save, .btn-cancel {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-save {
          background: #48bb78;
          color: white;
        }

        .btn-cancel {
          background: #f56565;
          color: white;
        }

        .btn-save:active, .btn-cancel:active {
          transform: scale(0.9);
        }

        .no-device {
          text-align: center;
          padding: 30px 20px;
          color: #a0aec0;
        }

        .no-device-icon {
          font-size: 48px;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .no-device p {
          margin: 0;
          font-size: 14px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .stat-card {
          text-align: center;
          padding: 16px 12px;
          background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 12px;
          color: #718096;
          font-weight: 500;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .quick-action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 8px;
          background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .quick-action-item:active {
          transform: scale(0.95);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .quick-action-item:active .quick-action-icon,
        .quick-action-item:active .quick-action-label {
          color: white;
        }

        .quick-action-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .quick-action-label {
          font-size: 12px;
          color: #4a5568;
          font-weight: 600;
          text-align: center;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .setting-item:hover {
          background: #f8f9fa;
        }

        .setting-item:active {
          background: #f0f2f5;
        }

        .setting-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .setting-icon {
          font-size: 20px;
        }

        .setting-label {
          font-size: 15px;
          color: #2d3748;
          font-weight: 500;
        }

        .setting-arrow {
          font-size: 20px;
          color: #cbd5e0;
        }

        .logout-button {
          width: 100%;
          background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
          color: #c53030;
          border: none;
          padding: 16px 20px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(254, 215, 215, 0.4);
        }

        .logout-button:active {
          transform: scale(0.96);
        }

        .logout-icon {
          font-size: 20px;
        }

        .version-info {
          text-align: center;
          padding: 20px;
          color: #a0aec0;
          font-size: 12px;
          line-height: 1.8;
        }

        .agreement-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .agreement-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .agreement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .agreement-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #2d3748;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f7fafc;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #edf2f7;
        }

        .agreement-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          line-height: 1.8;
        }

        .agreement-body h3 {
          font-size: 16px;
          font-weight: 700;
          color: #2d3748;
          margin: 20px 0 10px 0;
        }

        .agreement-body h3:first-child {
          margin-top: 0;
        }

        .agreement-body p {
          font-size: 14px;
          color: #4a5568;
          margin: 8px 0;
        }

        .agreement-body ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .agreement-body li {
          font-size: 14px;
          color: #4a5568;
          margin: 6px 0;
        }

        .agreement-footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }

        .agreement-footer p {
          font-size: 12px;
          color: #a0aec0;
          margin: 4px 0;
        }

        @media (max-width: 480px) {
          .profile-header {
            padding: 30px 16px 24px;
          }

          .user-avatar {
            width: 64px;
            height: 64px;
            font-size: 32px;
          }

          .user-name {
            font-size: 20px;
          }

          .user-email {
            font-size: 13px;
          }

          .profile-section {
            margin: 12px 16px;
            padding: 16px;
          }

          .section-title {
            font-size: 14px;
          }

          .device-card {
            padding: 14px;
          }

          .device-icon {
            font-size: 36px;
          }

          .stats-grid {
            gap: 10px;
          }

          .stat-card {
            padding: 14px 10px;
          }

          .stat-value {
            font-size: 20px;
          }

          .stat-label {
            font-size: 11px;
          }

          .quick-actions {
            gap: 10px;
          }

          .quick-action-item {
            padding: 12px 6px;
          }

          .quick-action-icon {
            font-size: 24px;
          }

          .quick-action-label {
            font-size: 11px;
          }

          .setting-item {
            padding: 12px 10px;
          }

          .setting-label {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default Profile
