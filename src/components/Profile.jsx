import { useState, useEffect } from 'react'
import { authService, deviceService } from '../services/supabase'

function Profile({ user, device, logs, onLogout, onDeviceAdded }) {
  const [showAgreement, setShowAgreement] = useState(false)
  const [showBindForm, setShowBindForm] = useState(false)
  const [showUnbindConfirm, setShowUnbindConfirm] = useState(false)
  const [macInput, setMacInput] = useState('')
  const [deviceName, setDeviceName] = useState('我的喂食器')
  const [binding, setBinding] = useState(false)
  const [unbinding, setUnbinding] = useState(false)
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

  const handleAboutUs = () => {
    window.open('https://github.com/clrkk25/pet-feeder-web', '_blank')
  }

  const handleBindDevice = async () => {
    if (!macInput.trim()) {
      alert('请输入设备MAC地址')
      return
    }
    
    const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/
    if (!macRegex.test(macInput.trim())) {
      alert('MAC地址格式不正确，正确格式如：A1:B2:C3:D4:E5:F6')
      return
    }
    
    setBinding(true)
    try {
      await deviceService.addDevice(macInput.trim().toUpperCase(), deviceName.trim() || '我的喂食器')
      alert('设备绑定成功！')
      setShowBindForm(false)
      setMacInput('')
      setDeviceName('我的喂食器')
      if (onDeviceAdded) {
        onDeviceAdded()
      }
    } catch (error) {
      console.error('绑定设备失败:', error)
      alert('绑定设备失败：' + (error.message || '未知错误'))
    } finally {
      setBinding(false)
    }
  }

  const handleUnbindDevice = async () => {
    if (!device) return
    
    setUnbinding(true)
    try {
      await deviceService.deleteDevice(device.id)
      alert('设备已解除绑定！')
      setShowUnbindConfirm(false)
      if (onDeviceAdded) {
        onDeviceAdded()
      }
    } catch (error) {
      console.error('解除绑定失败:', error)
      alert('解除绑定失败：' + (error.message || '未知错误'))
    } finally {
      setUnbinding(false)
    }
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
              <div className="device-text">
                {device.device_name || '我的喂食器'}：{device.device_mac}
              </div>
            </div>
            <button className="unbind-btn" onClick={() => setShowUnbindConfirm(true)}>
              解除绑定
            </button>
          </div>
        ) : (
          <div className="no-device">
            {!showBindForm ? (
              <>
                <div className="no-device-icon">📦</div>
                <p>暂无设备</p>
                <button className="bind-btn" onClick={() => setShowBindForm(true)}>
                  + 添加设备
                </button>
              </>
            ) : (
              <div className="bind-form">
                <div className="bind-form-title">添加设备</div>
                <div className="bind-form-hint">请在设备串口输出中查看MAC地址</div>
                <input
                  type="text"
                  className="bind-input"
                  placeholder="设备MAC地址 (如：A1:B2:C3:D4:E5:F6)"
                  value={macInput}
                  onChange={(e) => setMacInput(e.target.value)}
                />
                <input
                  type="text"
                  className="bind-input"
                  placeholder="设备名称"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                />
                <div className="bind-form-actions">
                  <button 
                    className="bind-cancel-btn" 
                    onClick={() => {
                      setShowBindForm(false)
                      setMacInput('')
                      setDeviceName('我的喂食器')
                    }}
                  >
                    取消
                  </button>
                  <button 
                    className="bind-confirm-btn" 
                    onClick={handleBindDevice}
                    disabled={binding}
                  >
                    {binding ? '绑定中...' : '确认绑定'}
                  </button>
                </div>
              </div>
            )}
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

      {showUnbindConfirm && (
        <div className="agreement-overlay">
          <div className="unbind-confirm-dialog">
            <div className="unbind-confirm-icon">⚠️</div>
            <h3 className="unbind-confirm-title">确认解除绑定？</h3>
            <p className="unbind-confirm-text">
              解除绑定后，您将无法再通过此账号控制该设备。喂食记录数据将被保留。
            </p>
            <div className="unbind-confirm-actions">
              <button 
                className="unbind-cancel-btn" 
                onClick={() => setShowUnbindConfirm(false)}
                disabled={unbinding}
              >
                取消
              </button>
              <button 
                className="unbind-confirm-btn" 
                onClick={handleUnbindDevice}
                disabled={unbinding}
              >
                {unbinding ? '解除中...' : '确认解除'}
              </button>
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
          margin: 12px;
          background: white;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #718096;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .device-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
          border-radius: 10px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .device-icon {
          font-size: 28px;
        }

        .device-info {
          flex: 1;
        }

        .device-text {
          font-size: 15px;
          font-weight: 600;
          color: #2d3748;
          text-align: center;
        }

        .unbind-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
          color: #c53030;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .unbind-btn:active {
          transform: scale(0.95);
        }

        .unbind-confirm-dialog {
          background: white;
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          max-width: 320px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .unbind-confirm-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .unbind-confirm-title {
          font-size: 18px;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 12px 0;
        }

        .unbind-confirm-text {
          font-size: 14px;
          color: #718096;
          margin: 0 0 24px 0;
          line-height: 1.6;
        }

        .unbind-confirm-actions {
          display: flex;
          gap: 12px;
        }

        .unbind-cancel-btn {
          flex: 1;
          padding: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.2s;
        }

        .unbind-cancel-btn:hover {
          background: #f7fafc;
        }

        .unbind-cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .unbind-confirm-btn {
          flex: 1;
          padding: 12px;
          border: none;
          background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
          color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .unbind-confirm-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .unbind-confirm-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .no-device {
          text-align: center;
          padding: 24px 16px;
          color: #a0aec0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-height: 140px;
        }

        .no-device-icon {
          font-size: 36px;
          margin-bottom: 0;
          opacity: 0.5;
        }

        .no-device p {
          margin: 0;
          font-size: 14px;
        }

        .bind-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bind-btn:active {
          transform: scale(0.96);
        }

        .bind-form {
          text-align: left;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bind-form-title {
          font-size: 16px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .bind-form-hint {
          font-size: 12px;
          color: #718096;
          margin-bottom: 16px;
        }

        .bind-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .bind-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .bind-form-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .bind-cancel-btn {
          flex: 1;
          padding: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bind-cancel-btn:hover {
          background: #f7fafc;
        }

        .bind-confirm-btn {
          flex: 1;
          padding: 12px;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bind-confirm-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bind-confirm-btn:active:not(:disabled) {
          transform: scale(0.98);
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

          .device-text {
            font-size: 14px;
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
