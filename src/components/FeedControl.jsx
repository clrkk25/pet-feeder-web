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
          placeholder="自定义份数(1-10)" 
          min="1" 
          max="10"
          value={customAmount}
          onChange={e => setCustomAmount(e.target.value)}
        />
        <button 
          className="btn btn-primary" 
          style={{ width: 'auto', padding: '12px 20px', marginBottom: 0 }}
          onClick={handleCustomFeed}
          disabled={feeding || !customAmount}
        >
          喂食
        </button>
      </div>
    </div>
  )
}

export default FeedControl
