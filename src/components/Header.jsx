import { useState, useEffect } from 'react'

function Header({ status, connected, device, onLogout }) {
  const [localTime, setLocalTime] = useState(() => {
    return new Date().toLocaleTimeString('zh-CN', { hour12: false })
  })
  const [timeOffset, setTimeOffset] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const syncedTime = new Date(now.getTime() + timeOffset)
      setLocalTime(syncedTime.toLocaleTimeString('zh-CN', { hour12: false }))
    }, 1000)
    
    return () => clearInterval(interval)
  }, [timeOffset])

  useEffect(() => {
    if (connected && status.time && status.time !== '--:--:--') {
      const timeParts = status.time.split(':')
      if (timeParts.length === 3) {
        const now = new Date()
        const serverTime = new Date()
        serverTime.setHours(parseInt(timeParts[0]))
        serverTime.setMinutes(parseInt(timeParts[1]))
        serverTime.setSeconds(parseInt(timeParts[2]))
        
        const offset = serverTime.getTime() - now.getTime()
        setTimeOffset(offset)
      }
    }
  }, [status.time, connected])

  return (
    <div className="card header">
      <div className="header-top">
        <h1>智能宠物喂食器</h1>
        <button className="logout-btn" onClick={onLogout}>退出</button>
      </div>
      <div className="time">{localTime}</div>
      {device && (
        <div className="device-info">
          <span className="device-name">{device.device_name || '未命名设备'}</span>
          <span className="device-mac">{device.device_mac}</span>
        </div>
      )}
      <div className="connection-status">
        <span className={`connection-dot ${connected ? 'connected' : ''}`}></span>
        {connected ? 'MQTT 已连接' : 'MQTT 断开'}
      </div>
      <div className="status">
        <div className="status-item">
          <div className="status-value">
            {status.feeding && <span className="feeding-indicator"></span>}
            {status.feeding ? '运行中' : '就绪'}
          </div>
          <div className="status-label">状态</div>
        </div>
        <div className="status-item">
          <div className="status-value">{status.feed_today}</div>
          <div className="status-label">今日喂食</div>
        </div>
        <div className="status-item">
          <div className="status-value">{status.rssi}dBm</div>
          <div className="status-label">信号强度</div>
        </div>
      </div>

      <style jsx>{`
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .header-top h1 {
          color: #333;
          font-size: 24px;
          margin: 0;
        }

        .logout-btn {
          padding: 8px 16px;
          background: #ff6b6b;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .logout-btn:hover {
          opacity: 0.8;
        }

        .device-info {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 8px;
          margin: 10px 0;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .device-name {
          font-weight: bold;
          color: #667eea;
        }

        .device-mac {
          color: #888;
        }
      `}</style>
    </div>
  )
}

export default Header
