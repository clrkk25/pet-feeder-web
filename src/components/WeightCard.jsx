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
    </div>
  )
}

export default WeightCard
