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
          color: #888;
          text-align: center;
          padding: 20px;
        }
        .record-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        .record-item:last-child {
          border-bottom: none;
        }
        .record-time {
          color: #888;
          font-size: 14px;
        }
        .record-info {
          font-size: 14px;
        }
        .record-type {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-left: 5px;
        }
        .record-type.auto {
          background: #e3f2fd;
          color: #1976d2;
        }
        .record-type.remote {
          background: #e8f5e9;
          color: #388e3c;
        }
        .more-btn {
          background: none;
          border: none;
          color: #4CAF50;
          font-size: 14px;
          cursor: pointer;
          padding: 0;
        }
        .more-btn:hover {
          color: #388E3C;
        }
      `}</style>
    </div>
  )
}

export default FeedLog
