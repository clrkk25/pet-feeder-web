function WeightCard({ weight, scaleReady, onTare }) {
  return (
    <div className="card">
      <div className="weight-card">
        <div className="weight-value">{weight.toFixed(1)}</div>
        <div className="weight-unit">克</div>
        <div className="weight-label">食物重量</div>
        {scaleReady ? (
          <button className="tare-btn" onClick={onTare}>归零</button>
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
