import { useMemo, useState, useRef, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'

function FeedHistory({ logs, onBack }) {
  const [timeRange, setTimeRange] = useState('month')
  const [displayCount, setDisplayCount] = useState(50)
  const [isLoading, setIsLoading] = useState(false)
  const tableRef = useRef(null)

  const getSourceLabel = (feedType) => {
    const labels = { auto: '定时', remote: '远程' }
    return labels[feedType] || feedType
  }

  const formatFullTime = (timestamp) => {
    if (!timestamp) return '--:--:--'
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
  }

  const timeRangeConfig = {
    week: { label: '近一周', days: 7, interval: 0 },
    twoweeks: { label: '近两周', days: 14, interval: 1 },
    month: { label: '近一个月', days: 30, interval: 3 }
  }

  const chartData = useMemo(() => {
    const days = timeRangeConfig[timeRange].days
    const startDate = dayjs().subtract(days, 'day')
    const dailyData = {}

    logs.forEach(log => {
      const date = dayjs(log.feed_time)
      if (date.isAfter(startDate)) {
        const dateKey = date.format('MM-DD')
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { date: dateKey, grams: 0, count: 0 }
        }
        dailyData[dateKey].grams += Number(log.grams) || 0
        dailyData[dateKey].count += 1
      }
    })

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date))
  }, [logs, timeRange])

  const stats = useMemo(() => {
    const configDays = timeRangeConfig[timeRange].days
    const startDate = dayjs().subtract(configDays, 'day')
    
    const filteredLogs = logs.filter(log => dayjs(log.feed_time).isAfter(startDate))
    
    const totalGrams = filteredLogs.reduce((sum, log) => sum + (Number(log.grams) || 0), 0)
    const totalFeeds = filteredLogs.length
    const avgPerFeed = totalFeeds > 0 ? totalGrams / totalFeeds : 0
    
    let actualDays = configDays
    if (filteredLogs.length > 0) {
      const firstFeedTime = filteredLogs.reduce((earliest, log) => {
        const logTime = dayjs(log.feed_time)
        return logTime.isBefore(earliest) ? logTime : earliest
      }, dayjs())
      const daysSinceFirst = dayjs().diff(firstFeedTime, 'day') + 1
      actualDays = Math.min(daysSinceFirst, configDays)
    }
    const avgPerDay = actualDays > 0 ? totalGrams / actualDays : 0

    const typeStats = {
      auto: filteredLogs.filter(l => l.feed_type === 'auto').length,
      remote: filteredLogs.filter(l => l.feed_type === 'remote').length
    }

    return {
      totalGrams,
      totalFeeds,
      avgPerFeed,
      avgPerDay,
      actualDays,
      typeStats
    }
  }, [logs, timeRange])

  const displayedLogs = logs.slice(0, displayCount)
  const hasMore = displayCount < logs.length

  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current || !hasMore || isLoading) return
      
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setIsLoading(true)
        setTimeout(() => {
          setDisplayCount(prev => Math.min(prev + 30, logs.length))
          setIsLoading(false)
        }, 500)
      }
    }

    const tableWrapper = tableRef.current
    tableWrapper?.addEventListener('scroll', handleScroll)
    return () => tableWrapper?.removeEventListener('scroll', handleScroll)
  }, [hasMore, isLoading, logs.length])

  return (
    <div className="history-page">
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>← 返回</button>
        <h2>喂食历史</h2>
      </div>

      <div className="history-content">
        <div className="chart-section">
          <div className="chart-header">
            <h3>喂食统计</h3>
            <div className="time-range-tabs">
              {Object.entries(timeRangeConfig).map(([key, config]) => (
                <button
                  key={key}
                  className={`tab-btn ${timeRange === key ? 'active' : ''}`}
                  onClick={() => setTimeRange(key)}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  interval={timeRangeConfig[timeRange].interval}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'grams' ? `${value.toFixed(1)}g` : `${value}次`,
                    name === 'grams' ? '总重量' : '喂食次数'
                  ]}
                />
                <Line type="monotone" dataKey="grams" stroke="#4CAF50" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">暂无数据</div>
          )}

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.totalGrams.toFixed(1)}</div>
              <div className="stat-label">总喂食量</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.totalFeeds}</div>
              <div className="stat-label">喂食次数</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.avgPerFeed.toFixed(1)}</div>
              <div className="stat-label">平均每次</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.avgPerDay.toFixed(1)}</div>
              <div className="stat-label">日均喂食({stats.actualDays}天)</div>
            </div>
          </div>

          <div className="type-stats">
            <span className="type-stat auto">定时 {stats.typeStats.auto}次</span>
            <span className="type-stat remote">远程 {stats.typeStats.remote}次</span>
          </div>
        </div>

        <div className="table-section">
          <h3>完整记录</h3>
          {logs.length === 0 ? (
            <div className="no-data">暂无喂食记录</div>
          ) : (
            <div className="table-wrapper" ref={tableRef}>
              <table className="record-table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>重量</th>
                    <th>类型</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{formatFullTime(log.feed_time)}</td>
                      <td>{`${Number(log.grams || 0).toFixed(1)}g`}</td>
                      <td>
                        <span className={`type-badge ${log.feed_type}`}>
                          {getSourceLabel(log.feed_type)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading && <div className="loading-more">加载中...</div>}
              {!hasMore && logs.length > 0 && <div className="no-more">已加载全部记录</div>}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .history-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .history-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        .history-header h2 {
          margin: 0;
          color: #333;
        }
        .back-btn {
          background: #f5f5f5;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        .back-btn:hover {
          background: #e0e0e0;
        }
        .history-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 900px) {
          .history-content {
            grid-template-columns: 1fr;
          }
        }
        .chart-section, .table-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .chart-header h3 {
          margin: 0;
          color: #333;
          font-size: 16px;
        }
        .time-range-tabs {
          display: flex;
          gap: 5px;
        }
        .tab-btn {
          background: #f5f5f5;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          color: #666;
        }
        .tab-btn.active {
          background: #4CAF50;
          color: white;
        }
        .tab-btn:hover:not(.active) {
          background: #e0e0e0;
        }
        .no-data {
          text-align: center;
          color: #888;
          padding: 40px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .stat-item {
          text-align: center;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
        }
        .stat-label {
          font-size: 12px;
          color: #888;
          margin-top: 4px;
        }
        .type-stats {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        .type-stat {
          font-size: 13px;
          padding: 4px 10px;
          border-radius: 4px;
        }
        .type-stat.auto {
          background: #e3f2fd;
          color: #1976d2;
        }
        .type-stat.remote {
          background: #e8f5e9;
          color: #388e3c;
        }
        .table-section h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
        }
        .table-wrapper {
          max-height: 400px;
          overflow-y: auto;
        }
        .record-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .record-table th, .record-table td {
          padding: 10px 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .record-table th {
          background: #f9f9f9;
          font-weight: 500;
          position: sticky;
          top: 0;
        }
        .type-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        .type-badge.auto {
          background: #e3f2fd;
          color: #1976d2;
        }
        .type-badge.remote {
          background: #e8f5e9;
          color: #388e3c;
        }
        .loading-more, .no-more {
          text-align: center;
          padding: 15px;
          color: #888;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

export default FeedHistory
