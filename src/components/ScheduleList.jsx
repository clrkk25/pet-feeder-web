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
        .add-schedule input[type="time"] {
          flex: 1;
          padding: 10px;
          border: 2px solid #eee;
          border-radius: 8px;
          font-size: 16px;
        }
        .add-schedule button {
          padding: 10px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
        }
        .empty-text {
          color: #888;
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
  )
}

export default ScheduleList
