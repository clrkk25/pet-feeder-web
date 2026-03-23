import { useState } from 'react'

function FeedControl({ onFeed, feeding }) {
  const [customAmount, setCustomAmount] = useState('')

  const handleCustomFeed = () => {
    const amount = parseInt(customAmount)
    if (amount >= 1 && amount <= 10) {
      onFeed(amount)
      setCustomAmount('')
    }
  }

  return (
    <div className="card">
      <div className="section-title">
        <div className="section-title-left">手动喂食</div>
      </div>
      <div className="feed-grid">
        {[1, 2, 3].map(amount => (
          <button 
            key={amount} 
            className="feed-btn" 
            onClick={() => onFeed(amount)}
            disabled={feeding}
          >
            <span className="amount">{amount}</span>
            <span className="unit">份</span>
          </button>
        ))}
      </div>
      <div className="custom-feed">
        <input 
          type="number" 
          placeholder="自定义份数 (1-10)" 
          min="1" 
          max="10"
          value={customAmount}
          onChange={e => setCustomAmount(e.target.value)}
          className="custom-input"
        />
        <button 
          className="btn btn-primary custom-btn" 
          onClick={handleCustomFeed}
          disabled={feeding || !customAmount}
        >
          喂食
        </button>
      </div>

      <style jsx>{`
        .custom-feed {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .custom-input {
          flex: 1;
          padding: 14px;
          border: 2px solid #eee;
          border-radius: 10px;
          font-size: 16px;
          min-height: 48px;
          transition: border-color 0.2s;
        }

        .custom-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .custom-btn {
          width: auto;
          padding: 14px 24px;
          min-width: 80px;
          min-height: 48px;
          font-size: 16px;
          font-weight: bold;
        }

        @media (max-width: 480px) {
          .custom-feed {
            flex-direction: column;
            gap: 8px;
          }

          .custom-input {
            width: 100%;
            font-size: 18px;
            min-height: 52px;
          }

          .custom-btn {
            width: 100%;
            min-height: 52px;
          }
        }
      `}</style>
    </div>
  )
}

export default FeedControl
