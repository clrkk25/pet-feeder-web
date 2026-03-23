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
          padding: 0 4px;
        }
        .image-wrapper {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        .camera-image {
          width: 100%;
          display: block;
          border-radius: 16px;
          object-fit: contain;
          max-height: 400px;
          background: #fff;
        }
        .image-time {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .no-image {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
          padding: 48px 24px;
          text-align: center;
          margin-bottom: 16px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        .camera-icon {
          font-size: 56px;
          margin-bottom: 16px;
          opacity: 0.6;
        }
        .no-image p {
          color: #718096;
          margin: 0;
          font-size: 15px;
          font-weight: 500;
        }
        .capture-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          min-height: 52px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .capture-btn:hover:not(:disabled) {
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.35);
        }
        .capture-btn:active:not(:disabled) {
          transform: scale(0.96);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        .capture-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          .camera-image {
            max-height: 280px;
          }
          
          .no-image {
            padding: 40px 20px;
          }
          
          .camera-icon {
            font-size: 48px;
          }
          
          .capture-btn {
            min-height: 52px;
            font-size: 16px;
          }
          
          .no-image p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}

export default CameraViewer
