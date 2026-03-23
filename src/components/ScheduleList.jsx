import { useState } from 'react'

function ScheduleList({ schedules, onToggle, onDelete, onAdd }) {
  const [time, setTime] = useState('')
  const [amount, setAmount] = useState('1')

  const handleAdd = () => {
    if (time && amount) {
      onAdd(time, parseInt(amount))
      setTime('')
      setAmount('1')
    }
  }

  return (
    <div className="card">
      <div className="section-title">
        <div className="section-title-left">定时计划</div>
      </div>
      <div>
        {schedules.length === 0 ? (
          <p className="empty-text">暂无定时计划</p>
        ) : (
          schedules.map((schedule, index) => (
            <div key={index} className="schedule-item">
              <div>
                <span className="schedule-time">{schedule.time}</span>
                <span className="schedule-amount">{schedule.amount}份</span>
              </div>
              <div className="schedule-right">
                <button 
                  className="schedule-delete"
                  onClick={() => onDelete(index)}
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
          style={{ width: '70px' }}
        />
        <button onClick={handleAdd}>添加</button>
      </div>
      <style jsx>{`
        .schedule-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
          border-radius: 12px;
          margin-bottom: 10px;
          border: 1px solid rgba(102, 126, 234, 0.1);
          transition: all 0.2s;
        }

        .schedule-item:hover {
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }

        .schedule-time {
          font-size: 22px;
          font-weight: 600;
          color: #2d3748;
          margin-right: 12px;
        }

        .schedule-amount {
          font-size: 15px;
          font-weight: 500;
          color: #718096;
        }

        .schedule-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .schedule-delete {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #fed7d7;
          color: #e53e3e;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .schedule-delete:active {
          transform: scale(0.9);
          background: #feb2b2;
        }

        .schedule-toggle {
          width: 44px;
          height: 24px;
          background: #cbd5e0;
          border-radius: 12px;
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
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .schedule-toggle.on::after {
          transform: translateX(20px);
        }

        .add-schedule {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .add-schedule input[type="time"] {
          flex: 1;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
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
          padding: 14px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
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
          padding: 14px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
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
            padding: 16px;
          }

          .schedule-time {
            font-size: 22px;
          }

          .schedule-amount {
            font-size: 15px;
          }

          .add-schedule {
            flex-wrap: wrap;
          }

          .add-schedule input[type="time"] {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default ScheduleList
