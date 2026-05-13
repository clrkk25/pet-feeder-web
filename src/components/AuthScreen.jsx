import { useState, useEffect } from 'react'
import { authService } from '../services/supabase'

const errorMessages = {
  'Invalid login credentials': '邮箱或密码错误',
  'Email not confirmed': '请先验证邮箱',
  'User already registered': '该邮箱已注册',
  'Password should be at least 6 characters': '密码至少需要6位',
  'Invalid email': '邮箱格式不正确',
  'User not found': '用户不存在',
  'Unable to validate email address': '邮箱格式无效',
  'Signup requires a valid password': '请输入有效密码',
  'User is banned': '账号已被禁用',
  'Email rate limit exceeded': '邮件发送过于频繁（每小时限4次），请稍后再试',
  'Invalid otp': '验证码错误',
  'Otp expired': '验证码已过期，请重新获取',
}

function translateError(message) {
  const lowerMessage = message.toLowerCase()
  for (const [key, value] of Object.entries(errorMessages)) {
    if (lowerMessage.includes(key.toLowerCase())) return value
  }
  return message
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const type = params.get('type')
    
    if (accessToken && type === 'recovery') {
      setMode('emailReset')
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await authService.signIn(email, password)
        onAuth()
      } else if (mode === 'register') {
        await authService.signUp(email, password)
        setError('注册成功，请查收验证邮件')
        setLoading(false)
        return
      } else if (mode === 'forgot') {
        await authService.sendOtp(email)
        setError('验证码已发送，请查收邮箱')
        setMode('forgotVerify')
        setLoading(false)
        return
      } else if (mode === 'forgotVerify') {
        if (newPassword !== confirmPassword) {
          setError('两次密码不一致')
          setLoading(false)
          return
        }
        if (newPassword.length < 6) {
          setError('新密码至少需要6位')
          setLoading(false)
          return
        }
        if (otpCode.length !== 6) {
          setError('请输入6位验证码')
          setLoading(false)
          return
        }
        await authService.verifyOtp(email, otpCode)
        await authService.updatePassword(newPassword)
        setError('密码重置成功')
        setOtpCode('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => {
          setMode('login')
          setError('')
        }, 1500)
      } else if (mode === 'reset') {
        if (newPassword !== confirmPassword) {
          setError('两次密码不一致')
          setLoading(false)
          return
        }
        if (newPassword.length < 6) {
          setError('新密码至少需要6位')
          setLoading(false)
          return
        }
        await authService.signIn(email, password)
        await authService.updatePassword(newPassword)
        setError('密码修改成功')
        setPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => {
          setMode('login')
          setError('')
        }, 1500)
      } else if (mode === 'emailReset') {
        if (newPassword !== confirmPassword) {
          setError('两次密码不一致')
          setLoading(false)
          return
        }
        if (newPassword.length < 6) {
          setError('新密码至少需要6位')
          setLoading(false)
          return
        }
        await authService.updatePassword(newPassword)
        setError('密码修改成功')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => {
          setMode('login')
          setError('')
        }, 1500)
      }
    } catch (err) {
      setError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'login': return '欢迎回来'
      case 'register': return '创建账号'
      case 'forgot': return '找回密码'
      case 'forgotVerify': return '设置新密码'
      case 'reset': return '修改密码'
      case 'emailReset': return '重置密码'
      default: return ''
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🐾</div>
          <h1>智能宠物喂食器</h1>
          <p>{getTitle()}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {(mode === 'login' || mode === 'register' || mode === 'reset' || mode === 'forgotVerify') && (
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  autoComplete="email"
                  required
                  disabled={mode === 'forgotVerify'}
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          {mode === 'reset' && (
            <>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入旧密码"
                    autoComplete="current-password"
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请确认新密码"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          )}

          {mode === 'forgotVerify' && (
            <>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">�</span>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入6位验证码"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">�🔑</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请确认新密码"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </>
          )}

          {mode === 'emailReset' && (
            <>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请确认新密码"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </>
          )}

          {mode === 'forgot' && (
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  autoComplete="email"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className={`error-message ${error.includes('成功') || error.includes('已发送') ? 'success' : ''}`}>
              {error}
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              mode === 'login' ? '登 录' : 
              mode === 'register' ? '注 册' : 
              mode === 'forgot' ? '发送验证码' : 
              mode === 'forgotVerify' ? '确认重置' :
              mode === 'reset' ? '确认修改' : '确认重置'
            )}
          </button>

          {mode === 'forgotVerify' && (
            <button 
              type="button" 
              className="secondary-btn"
              onClick={async () => {
                setError('')
                setLoading(true)
                try {
                  await authService.sendOtp(email)
                  setError('验证码已重新发送')
                } catch (err) {
                  setError(translateError(err.message))
                } finally {
                  setLoading(false)
                }
              }}
            >
              重新发送验证码
            </button>
          )}

          {mode === 'reset' && (
            <button 
              type="button" 
              className="secondary-btn"
              onClick={() => { setMode('forgot'); setError('') }}
            >
              忘记旧密码？通过邮箱重置
            </button>
          )}
        </form>

        <div className="auth-footer">
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('reset'); setError('') }}>
                修改密码
              </button>
              <span className="divider">|</span>
              <button onClick={() => { setMode('register'); setError('') }}>
                立即注册
              </button>
            </>
          )}
          {mode === 'register' && (
            <button onClick={() => { setMode('login'); setError('') }}>
              已有账号？立即登录
            </button>
          )}
          {(mode === 'forgot' || mode === 'forgotVerify') && (
            <button onClick={() => { setMode('login'); setError(''); setOtpCode('') }}>
              返回登录
            </button>
          )}
          {mode === 'reset' && (
            <button onClick={() => { setMode('login'); setError('') }}>
              返回登录
            </button>
          )}
          {mode === 'emailReset' && (
            <button onClick={() => { setMode('login'); setError('') }}>
              返回登录
            </button>
          )}
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .auth-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-icon {
          font-size: 64px;
          margin-bottom: 10px;
        }

        .auth-header h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 10px;
        }

        .auth-header p {
          color: #888;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          font-size: 18px;
        }

        .input-wrapper input {
          width: 100%;
          padding: 12px 40px 12px 44px;
          border: 2px solid #eee;
          border-radius: 10px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #667eea;
        }

        .input-wrapper input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          padding: 0;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .error-message.success {
          background: #efe;
          color: #3a3;
        }

        .auth-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .secondary-btn {
          width: 100%;
          padding: 12px;
          margin-top: 12px;
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-btn:hover {
          background: #667eea;
          color: white;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .auth-footer button {
          background: none;
          border: none;
          color: #667eea;
          font-size: 14px;
          cursor: pointer;
        }

        .auth-footer button:hover {
          text-decoration: underline;
        }

        .divider {
          color: #ccc;
        }
      `}</style>
    </div>
  )
}

export default AuthScreen
