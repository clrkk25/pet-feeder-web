import { useState } from 'react'

function CameraViewer({ onCapture, imageUrl, loading }) {
  return (
    <div className="card camera-card">
      <div className="section-title">
        <div className="section-title-left">查看画面</div>
      </div>
      
      <div className="camera-container">
        {imageUrl ? (
          <div className="image-wrapper">
            <img src={imageUrl} alt="宠物画面" className="camera-image" />
            <div className="image-time">
              {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ) : (
          <div className="no-image">
            <div className="camera-icon">📷</div>
            <p>点击下方按钮查看实时画面</p>
          </div>
        )}
        
        <button 
          className="capture-btn" 
          onClick={onCapture}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              加载中...
            </>
          ) : (
            <>
              <span>📸</span>
              查看画面
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .camera-card {
          margin-top: 15px;
        }
        .camera-container {
          padding: 15px 0;
        }
        .image-wrapper {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 15px;
          background: #f5f5f5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .camera-image {
          width: 100%;
          display: block;
          border-radius: 12px;
          object-fit: contain;
          max-height: 400px;
        }
        .image-time {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
        }
        .no-image {
          background: #f5f5f5;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          margin-bottom: 15px;
        }
        .camera-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .no-image p {
          color: #888;
          margin: 0;
          font-size: 14px;
        }
        .capture-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.1s, opacity 0.2s;
          min-height: 48px;
          touch-action: manipulation;
        }
        .capture-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        .capture-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .capture-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          .camera-image {
            max-height: 300px;
          }
          
          .no-image {
            padding: 30px 15px;
          }
          
          .camera-icon {
            font-size: 40px;
          }
          
          .capture-btn {
            min-height: 52px;
            font-size: 17px;
          }
        }
      `}</style>
    </div>
  )
}

export default CameraViewer
