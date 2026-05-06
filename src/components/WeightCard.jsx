import { useState } from 'react'

function WeightCard({ weight, scaleReady, onTare }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleTareClick = () => {
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    onTare()
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  return (
    <div className="card">
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <div className="confirm-icon">⚖️</div>
            <div className="confirm-title">确认归零</div>
            <div className="confirm-message">是否将当前重量设为零点？</div>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={handleCancel}>取消</button>
              <button className="confirm-btn" onClick={handleConfirm}>确认</button>
            </div>
          </div>
        </div>
      )}

      <div className="weight-card">
        <div className="weight-value">{weight.toFixed(1)}</div>
        <div className="weight-unit">克</div>
        <div className="weight-label">食物重量</div>
        {scaleReady ? (
          <button className="tare-btn" onClick={handleTareClick}>归零</button>
        ) : (
          <div className="weight-label">传感器未连接</div>
        )}
      </div>

      <style jsx>{`
        .weight-card {
          text-align: center;
          padding: 28px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
        }
        .weight-value {
          font-size: 56px;
          font-weight: 700;
          color: white;
          line-height: 1;
          letter-spacing: -2px;
        }
        .weight-unit {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-top: 6px;
        }
        .weight-label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 8px;
        }
        .tare-btn {
          background: rgba(255, 255, 255, 0.25);
          color: white;
          padding: 10px 28px;
          border: none;
          border-radius: 20px;
          margin-top: 16px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
          min-height: 40px;
          backdrop-filter: blur(10px);
        }
        .tare-btn:active {
          background: rgba(255, 255, 255, 0.35);
          transform: scale(0.95);
        }
        .confirm-overlay {
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
        }
        .confirm-box {
          background: white;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          max-width: 280px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .confirm-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }
        .confirm-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }
        .confirm-message {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
        .confirm-actions {
          display: flex;
          gap: 12px;
        }
        .confirm-cancel {
          flex: 1;
          padding: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          cursor: pointer;
        }
        .confirm-cancel:hover {
          background: #f7fafc;
        }
        .confirm-btn {
          flex: 1;
          padding: 12px;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .confirm-btn:hover {
          opacity: 0.9;
        }
        @media (max-width: 480px) {
          .weight-card {
            padding: 28px 20px;
          }
          .weight-value {
            font-size: 56px;
          }
          .weight-unit {
            font-size: 16px;
          }
          .weight-label {
            font-size: 14px;
          }
          .tare-btn {
            padding: 10px 28px;
            min-height: 40px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default WeightCard