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
          margin-bottom: 12px;
        }

        .header-top h1 {
          color: #1a1a1a;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .logout-btn {
          padding: 8px 18px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.2s;
          min-width: 60px;
          min-height: 38px;
          box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
        }

        .logout-btn:active {
          transform: scale(0.95);
        }

        .device-info {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 14px;
          border-radius: 12px;
          margin: 12px 0;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          flex-wrap: wrap;
          gap: 6px;
          border: 1px solid rgba(102, 126, 234, 0.15);
        }

        .device-name {
          font-weight: 600;
          color: #667eea;
        }

        .device-mac {
          color: #6c757d;
          font-family: monospace;
        }

        .connection-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #4a5568;
          margin-top: 10px;
        }

        .connection-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e0;
          transition: background 0.3s;
        }

        .connection-dot.connected {
          background: #48bb78;
          box-shadow: 0 0 8px rgba(72, 187, 120, 0.4);
        }

        @media (max-width: 480px) {
          .header-top {
            margin-bottom: 10px;
          }
          
          .header-top h1 {
            font-size: 19px;
            font-weight: 700;
          }
          
          .logout-btn {
            padding: 7px 16px;
            font-size: 13px;
            min-height: 36px;
            border-radius: 10px;
          }
          
          .device-info {
            padding: 12px;
            font-size: 12px;
            margin: 10px 0;
          }
          
          .device-name {
            width: 100%;
            margin-bottom: 4px;
            font-size: 13px;
          }
          
          .connection-status {
            font-size: 11px;
            margin-top: 8px;
          }
          
          .connection-dot {
            width: 6px;
            height: 6px;
          }
          
          .status {
            padding: 12px 0 8px;
            margin: 12px 0 0;
          }
          
          .status-value {
            font-size: 17px;
          }
          
          .status-label {
            font-size: 11px;
            margin-top: 4px;
          }
        }
      `}</style>
    </div>
  )
}

export default Header
