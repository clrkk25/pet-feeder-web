function FeedLog({ logs, onMore }) {
  const getSourceLabel = (feedType) => {
    const labels = { auto: '定时', remote: '远程' }
    return labels[feedType] || feedType
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--:--'
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const recentLogs = logs.slice(0, 5)

  return (
    <div className="card">
      <div className="section-title">
        <div className="section-title-left">喂食记录</div>
        {logs.length > 5 && (
          <button className="more-btn" onClick={onMore}>
            更多 ›
          </button>
        )}
      </div>
      <div>
        {recentLogs.length === 0 ? (
          <p className="empty-text">暂无喂食记录</p>
        ) : (
          recentLogs.map((log) => (
            <div key={log.id} className="record-item">
              <span className="record-time">{formatTime(log.feed_time)}</span>
              <span className="record-info">
                {`${Number(log.grams || 0).toFixed(1)}g`}
                <span className={`record-type ${log.feed_type}`}>
                  {getSourceLabel(log.feed_type)}
                </span>
              </span>
            </div>
          ))
        )}
      </div>
      <style jsx>{`
        .empty-text {
          color: #a0aec0;
          text-align: center;
          padding: 24px;
          font-size: 14px;
        }
        .record-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #e2e8f0;
          transition: background 0.2s;
        }
        .record-item:last-child {
          border-bottom: none;
        }
        .record-item:hover {
          background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
          margin: 0 -16px;
          padding-left: 16px;
          padding-right: 16px;
        }
        .record-time {
          color: #718096;
          font-size: 14px;
          font-weight: 500;
        }
        .record-info {
          font-size: 15px;
          font-weight: 600;
          color: #2d3748;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .record-type {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 8px;
        }
        .record-type.auto {
          background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
          color: #2c5282;
        }
        .record-type.remote {
          background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
          color: #22543d;
        }
        .more-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        }
        .more-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  )
}

export default FeedLog
