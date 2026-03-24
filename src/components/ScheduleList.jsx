import { useState, useMemo } from 'react'

function ScheduleList({ schedules, onToggle, onDelete, onAdd }) {
  const [time, setTime] = useState('')
  const [amount, setAmount] = useState('1')
  const [deleteIndex, setDeleteIndex] = useState(null)

  const handleAdd = () => {
    if (time && amount) {
      onAdd(time, parseInt(amount))
      setTime('')
      setAmount('1')
    }
  }

  const handleDeleteClick = (index) => {
    if (deleteIndex === index) {
      onDelete(index)
      setDeleteIndex(null)
    } else {
      setDeleteIndex(index)
    }
  }

  const handleItemFocus = () => {
    setDeleteIndex(null)
  }

  // 按时间排序（从早到晚）
  const sortedSchedules = useMemo(() => {
    return [...schedules].sort((a, b) => {
      return a.time.localeCompare(b.time)
    })
  }, [schedules])

  return (
    <div className="card">
      <div className="section-title">
        <div className="section-title-left">定时计划</div>
      </div>
      <div>
        {schedules.length === 0 ? (
          <p className="empty-text">暂无定时计划</p>
        ) : (
          sortedSchedules.map((schedule, index) => (
            <div 
              key={index} 
              className="schedule-item"
              onClick={handleItemFocus}
            >
              <div>
                <span className="schedule-time">{schedule.time}</span>
                <span className="schedule-amount">{schedule.amount}份</span>
              </div>
              <div className="schedule-right">
                <button 
                  className={`schedule-delete ${deleteIndex === index ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(index)
                  }}
                >
                  X
                </button>
                <div 
                  className={`schedule-toggle ${schedule.enabled ? 'on' : ''}`}
                  onClick={() => onToggle(index)}
                />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="add-schedule">
        <input 
          type="time" 
          value={time}
          onChange={e => setTime(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="份数" 
          min="1" 
          max="10"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button onClick={handleAdd}>添加</button>
      </div>
      <style jsx>{`
        .schedule-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
          border-radius: 10px;
          margin-bottom: 6px;
          border: 1px solid rgba(102, 126, 234, 0.1);
          transition: all 0.2s;
        }

        .schedule-item:hover {
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }

        .schedule-time {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin-right: 10px;
        }

        .schedule-amount {
          font-size: 13px;
          font-weight: 500;
          color: #718096;
        }

        .schedule-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .schedule-delete {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #e2e8f0;
          color: #2d3748;
          border: none;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .schedule-delete:hover {
          background: #cbd5e0;
        }

        .schedule-delete.active {
          background: #e53e3e;
          color: white;
        }

        .schedule-delete:active {
          transform: scale(0.9);
        }

        .schedule-toggle {
          width: 40px;
          height: 22px;
          background: #cbd5e0;
          border-radius: 11px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }

        .schedule-toggle.on {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .schedule-toggle::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .schedule-toggle.on::after {
          transform: translateX(-4px);
        }

        .add-schedule {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          align-items: center;
          flex-wrap: nowrap;
        }

        .add-schedule input[type="time"] {
          flex: 1;
          min-width: 120px;
          padding: 12px 14px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          background: white;
        }

        .add-schedule input[type="time"]:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .add-schedule input[type="number"] {
          width: 80px;
          flex-shrink: 0;
          padding: 12px 14px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          transition: all 0.2s;
          background: white;
        }

        .add-schedule input[type="number"]:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .add-schedule button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .add-schedule button:active {
          transform: scale(0.95);
        }

        .empty-text {
          color: #a0aec0;
          text-align: center;
          padding: 24px;
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .schedule-item {
            padding: 8px 10px;
            margin-bottom: 4px;
          }

          .schedule-time {
            font-size: 16px;
            margin-right: 8px;
          }

          .schedule-amount {
            font-size: 12px;
          }

          .schedule-right {
            gap: 6px;
          }

          .schedule-delete {
            width: 24px;
            height: 24px;
            font-size: 14px;
          }

          .schedule-toggle {
            width: 36px;
            height: 20px;
          }

          .schedule-toggle::after {
            width: 14px;
            height: 14px;
            top: 3px;
            left: 3px;
          }

          .schedule-toggle.on::after {
            transform: translateX(-4px);
          }

          .add-schedule {
            gap: 6px;
            margin-top: 12px;
          }

          .add-schedule input[type="time"] {
            min-width: 90px;
            padding: 10px 12px;
            font-size: 13px;
          }

          .add-schedule input[type="number"] {
            width: 60px;
            padding: 10px 12px;
            font-size: 13px;
          }

          .add-schedule button {
            padding: 10px 16px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}

export default ScheduleList
