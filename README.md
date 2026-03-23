# 智能宠物喂食器 - Web 控制器

基于 React + MQTT + Supabase 的 web 控制器

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录

---

## 📋 功能特性

### ✅ 已实现

- **用户认证**
  - 注册/登录
  - 基于 Supabase Auth
  - 自动登录状态保持

- **设备管理**
  - 自动加载用户设备
  - 显示设备信息（名称、MAC 地址）
  - 多设备支持

- **MQTT 实时控制**
  - 实时连接状态显示
  - 订阅设备状态更新
  - 发送控制指令

- **喂食控制**
  - 手动喂食（1-3 份 + 自定义）
  - 定时计划管理
  - 实时重量显示
  - 归零功能

- **数据同步**
  - 喂食记录自动同步到 Supabase
  - 设备信息持久化
  - 历史记录查看

---

## 🔧 配置说明

### Supabase 配置

已在 `src/services/supabase.js` 中配置：

```javascript
const SUPABASE_URL = 'https://vchehfrjgoibvcyjzlel.supabase.co'
const SUPABASE_ANON_KEY = '你的 anon key'
```

### MQTT 配置

已在 `src/App.jsx` 中配置：

```javascript
const MQTT_CONFIG = {
  url: 'wss://d55a4f21.ala.asia-southeast1.emqxsl.com:8084/mqtt',
  username: 'esp32-feeder',
  password: 'dpBA46K:k!HhRZz'
}
```

---

## 📱 使用流程

1. **注册/登录**
   - 打开网页
   - 输入邮箱和密码
   - 点击注册或登录

2. **添加设备**
   - 首次使用需要先在数据库中插入设备记录
   - 设备会自动出现在列表中

3. **控制喂食器**
   - 选择设备
   - 查看实时重量
   - 手动喂食或设置定时计划

4. **查看记录**
   - 所有喂食记录自动同步
   - 在"喂食记录"卡片中查看

---

## 🛠️ 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 5
- **MQTT 客户端**: mqtt.js 5
- **后端服务**: Supabase
  - 认证：Supabase Auth
  - 数据库：PostgreSQL
  - 实时订阅：Realtime

---

## 📂 项目结构

```
web-controller/
├── src/
│   ├── components/
│   │   ├── AuthScreen.jsx       # 登录/注册界面
│   │   ├── Header.jsx           # 头部组件
│   │   ├── WeightCard.jsx       # 重量显示
│   │   ├── FeedControl.jsx      # 喂食控制
│   │   ├── ScheduleList.jsx     # 定时计划
│   │   └── FeedLog.jsx          # 喂食记录
│   ├── services/
│   │   └── supabase.js          # Supabase 服务
│   ├── App.jsx                  # 主应用组件
│   ├── main.jsx                 # 入口文件
│   └── index.css                # 全局样式
├── package.json
├── vite.config.js
└── index.html
```

---

## 🔐 安全说明

- Supabase 密钥已配置行级安全（RLS）
- 用户只能访问自己的设备数据
- MQTT 密码建议定期更换

---

## 📝 注意事项

1. **首次使用**需要先在 Supabase 中插入设备记录
2. **ESP32 设备**需要连接到相同的 MQTT 服务器
3. **网络要求**：需要稳定的网络连接

---

## 🎨 UI 特点

- 渐变紫色主题
- 响应式设计（支持手机/平板）
- 实时状态显示
- 平滑动画效果
- 现代化卡片布局

---

## 📞 问题反馈

如有问题，请检查：
1. 浏览器控制台错误信息
2. Supabase 项目配置
3. MQTT 连接状态
4. 数据库表结构是否正确

---

## 🎯 下一步

- [ ] 添加设备管理界面（添加/删除设备）
- [ ] 优化喂食记录展示
- [ ] 添加统计图表
- [ ] 支持多设备切换

---

**MIT License**
