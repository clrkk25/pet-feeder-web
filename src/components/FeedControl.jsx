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
        .section-title {
          margin-bottom: 18px;
        }

        .feed-grid {
          gap: 14px;
          margin-bottom: 18px;
        }

        .feed-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 24px 12px;
          font-size: 14px;
          cursor: pointer;
          text-align: center;
          transition: transform 0.15s, box-shadow 0.2s;
          min-height: 96px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
        }

        .feed-btn:active {
          transform: scale(0.95);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .feed-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .feed-btn .amount {
          font-size: 32px;
          font-weight: 700;
          display: block;
        }

        .feed-btn .unit {
          font-size: 14px;
          font-weight: 500;
          opacity: 0.95;
        }

        .custom-feed {
          display: flex;
          gap: 14px;
          margin-top: 0;
        }

        .custom-input {
          flex: 1;
          padding: 16px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          min-height: 52px;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: white;
          font-weight: 500;
        }

        .custom-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .custom-input::placeholder {
          color: #a0aec0;
        }

        .custom-btn {
          width: auto;
          padding: 16px 28px;
          min-width: 100px;
          min-height: 52px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          transition: transform 0.15s, box-shadow 0.2s;
        }

        .custom-btn:active {
          transform: scale(0.95);
        }

        .custom-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 480px) {
          .section-title {
            margin-bottom: 18px;
            font-size: 17px;
          }

          .feed-grid {
            gap: 14px;
            margin-bottom: 18px;
          }

          .feed-btn {
            border-radius: 16px;
            padding: 24px 12px;
            min-height: 96px;
          }

          .feed-btn .amount {
            font-size: 32px;
          }

          .feed-btn .unit {
            font-size: 14px;
          }

          .custom-feed {
            flex-direction: column;
            gap: 12px;
          }

          .custom-input {
            width: 100%;
            padding: 15px 16px;
            font-size: 17px;
            min-height: 52px;
          }

          .custom-btn {
            width: 100%;
            min-height: 52px;
            padding: 15px 28px;
          }
        }
      `}</style>
    </div>
  )
}

export default FeedControl
