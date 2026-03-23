import { useState, useEffect, useCallback, useRef } from 'react'
import mqtt from 'mqtt'
import { authService, deviceService } from './services/supabase'
import AuthScreen from './components/AuthScreen'
import Header from './components/Header'
import WeightCard from './components/WeightCard'
import FeedControl from './components/FeedControl'
import ScheduleList from './components/ScheduleList'
import FeedLog from './components/FeedLog'
import FeedHistory from './components/FeedHistory'
import CameraViewer from './components/CameraViewer'
import BottomNav from './components/BottomNav'

const MQTT_CONFIG = {
  url: 'wss://d55a4f21.ala.asia-southeast1.emqxsl.com:8084/mqtt',
  options: {
    username: 'esp32-feeder',
    password: 'dpBA46K:k!HhRZz',
    reconnectPeriod: 5000
  }
}

const TOPICS = {
  status: 'pet/feeder/status',
  log: 'pet/feeder/log',
  schedule: 'pet/feeder/schedule',
  control: 'pet/feeder/control',
  scheduleSet: 'pet/feeder/schedule/set',
  cameraControl: 'pet/camera/control',
  cameraStatus: 'pet/camera/status'
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [connected, setConnected] = useState(false)
  const [currentDevice, setCurrentDevice] = useState(null)
  const [devices, setDevices] = useState([])
  const [status, setStatus] = useState({
    feed_today: 0,
    rssi: 0,
    time: '--:--:--',
    feeding: false,
    weight: 0,
    scaleReady: false
  })
  const [schedules, setSchedules] = useState([])
  const [logs, setLogs] = useState([])
  const [showLowFoodAlert, setShowLowFoodAlert] = useState(false)
  const [cameraImage, setCameraImage] = useState(null)
  const [cameraLoading, setCameraLoading] = useState(false)
  const clientRef = useRef(null)
  const lastCheckTimeRef = useRef(null)

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadDevices()
      loadFeedRecords()
    }
  }, [isAuthenticated])

  const loadDevices = async () => {
    try {
      const devicesData = await deviceService.getDevices()
      setDevices(devicesData)
      if (devicesData.length > 0) {
        setCurrentDevice(devicesData[0])
      }
    } catch (error) {
      console.error('加载设备失败:', error)
    }
  }

  const checkLowFood = useCallback((records) => {
    if (!records || records.length === 0) return
    const latest = records[0]
    if (!latest.feed_time) return
    
    if (lastCheckTimeRef.current === latest.feed_time) return
    lastCheckTimeRef.current = latest.feed_time

    const grams = Number(latest.grams) || 0
    const feedType = latest.feed_type
    
    if (grams < 0.5 && (feedType === 'auto' || feedType === 'remote')) {
      setShowLowFoodAlert(true)
    }
  }, [])

  const loadFeedRecords = async () => {
    try {
      const records = await deviceService.getAllFeedRecords()
      setLogs(records)
      checkLowFood(records)
    } catch (error) {
      console.error('加载喂养记录失败:', error)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return

    const client = mqtt.connect(MQTT_CONFIG.url, MQTT_CONFIG.options)
    clientRef.current = client

    client.on('connect', () => {
      console.log('[MQTT] 连接成功')
      setConnected(true)
      client.subscribe([
        TOPICS.status, 
        TOPICS.log, 
        TOPICS.schedule,
        TOPICS.cameraStatus
      ], (err) => {
        if (err) {
          console.error('[MQTT] 订阅失败:', err)
        } else {
          console.log('[MQTT] 订阅成功')
          client.publish(TOPICS.control, 'status')
        }
      })
    })

    client.on('close', () => {
      console.log('[MQTT] 连接关闭')
      setConnected(false)
    })
    
    client.on('error', (err) => {
      console.error('[MQTT] 连接错误:', err)
      setConnected(false)
    })

    client.on('message', async (topic, message) => {
      const payload = message.toString()
      console.log('[MQTT] 收到消息:', topic, payload)
      
      if (topic === TOPICS.status) {
        try {
          const data = JSON.parse(payload)
          setStatus(prev => ({ ...prev, ...data }))
        } catch (e) {
          console.error('[MQTT] 状态解析失败:', e)
        }
      } else if (topic === TOPICS.log) {
        const parts = payload.split(',')
        if (parts.length >= 4 && currentDevice) {
          try {
            await deviceService.addFeedRecord(
              currentDevice.id,
              parseInt(parts[1]),
              parseFloat(parts[2]),
              parts[3]
            )
            await loadFeedRecords()
          } catch (error) {
            console.error('同步记录失败:', error)
          }
        }
      } else if (topic === TOPICS.schedule) {
        try {
          const data = JSON.parse(payload)
          setSchedules(data.schedules || [])
        } catch (e) {
          console.error('[MQTT] 定时计划解析失败:', e)
        }
      } else if (topic === TOPICS.cameraStatus) {
        try {
          const data = JSON.parse(payload)
          setCameraImage(data.url)
          setCameraLoading(false)
          console.log('[CAMERA] 图片 URL:', data.url)
        } catch (e) {
          console.error('[CAMERA] 状态解析失败:', e)
          setCameraLoading(false)
        }
      }
    })

    return () => {
      if (client) client.end()
    }
  }, [isAuthenticated, currentDevice])

  const publish = useCallback((topic, message) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish(topic, message)
    }
  }, [])

  const feed = useCallback((amount) => {
    publish(TOPICS.control, `feed${amount}`)
  }, [publish])

  const tare = useCallback(() => {
    publish(TOPICS.control, 'tare')
  }, [publish])

  const addSchedule = useCallback((time, amount) => {
    publish(TOPICS.scheduleSet, `${time},${amount}`)
  }, [publish])

  const toggleSchedule = useCallback((index) => {
    publish(TOPICS.scheduleSet, `toggle,${index}`)
  }, [publish])

  const deleteSchedule = useCallback((index) => {
    publish(TOPICS.scheduleSet, `delete,${index}`)
  }, [publish])

  const handleCapture = useCallback(() => {
    if (cameraLoading) return
    setCameraLoading(true)
    setCameraImage(null)
    publish(TOPICS.cameraControl, 'capture')
  }, [cameraLoading, publish])

  const handleLogout = async () => {
    try {
      await authService.signOut()
      setIsAuthenticated(false)
      setConnected(false)
      if (clientRef.current) clientRef.current.end()
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuth={() => setIsAuthenticated(true)} />
  }

  if (showHistory || activeTab === 'history') {
    return (
      <>
        <FeedHistory logs={logs} onBack={() => { setShowHistory(false); setActiveTab('home'); }} />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    )
  }

  return (
    <>
      <div className="container">
        {showLowFoodAlert && (
          <div className="alert-overlay">
            <div className="alert-box">
              <div className="alert-icon">⚠️</div>
              <div className="alert-title">余粮不足</div>
              <div className="alert-message">请及时补充宠物粮食</div>
              <button className="alert-btn" onClick={() => setShowLowFoodAlert(false)}>
                我知道了
              </button>
            </div>
          </div>
        )}

        <Header 
          status={status} 
          connected={connected} 
          device={currentDevice}
          devices={devices}
          onDeviceChange={setCurrentDevice}
          onLogout={handleLogout}
        />
        <WeightCard weight={status.weight} scaleReady={status.scaleReady} onTare={tare} />
        <FeedControl onFeed={feed} feeding={status.feeding} />
        <ScheduleList 
          schedules={schedules} 
          onToggle={toggleSchedule} 
          onDelete={deleteSchedule}
          onAdd={addSchedule}
        />
        <CameraViewer 
          imageUrl={cameraImage}
          onCapture={handleCapture}
          loading={cameraLoading}
        />
        <FeedLog logs={logs} onMore={() => setShowHistory(true)} />
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <style>{`
        .alert-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .alert-box {
          background: white;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          max-width: 300px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .alert-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }
        .alert-title {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        .alert-message {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
        .alert-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 12px 40px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        }
        .alert-btn:hover {
          background: #388E3C;
        }
      `}</style>
    </>
  )
}

export default App
