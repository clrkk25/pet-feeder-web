# 智能宠物喂食器 - Web 控制器

基于 React + MQTT + Supabase 的智能宠物喂食器 Web 控制端

## 功能特性

- 📱 **移动端优化** - 完美适配手机和平板
- 📷 **实时画面** - 查看宠物和余粮情况
- 🍽️ **智能投喂** - 手动/定时/远程三种模式
- 📊 **数据统计** - 喂食记录可视化分析
- 📤 **数据导出** - 支持导出喂食记录和定时计划为 CSV 文件
- ⚙️ **远程更新** - OTA 远程固件升级，支持版本管理和进度显示
- ⚠️ **余粮提醒** - 自动检测余粮不足
- 🔐 **设备管理** - 设备绑定/解绑，MAC 地址验证
- 📝 **用户协议** - 完善的服务条款和使用规范

## 技术栈

- React 18
- Vite 5
- MQTT over WebSocket
- Supabase (Auth + Storage + Database)
- Recharts (数据可视化)

## 部署到 GitHub Pages

### 1. 修改配置

编辑 `vite.config.js`，将 `base` 改为你的仓库名：

```javascript
base: '/你的仓库名/',
```

### 2. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 3. 配置 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. **Source** 选择 **GitHub Actions**
3. 等待 Action 运行完成

### 4. 访问

```
https://你的用户名.github.io/你的仓库名/
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 环境变量

创建 `.env` 文件（不需要提交到 Git）：

```env
VITE_SUPABASE_URL=你的 Supabase URL
VITE_SUPABASE_ANON_KEY=你的 Supabase Anon Key
VITE_MQTT_URL=wss://你的 MQTT 服务器
VITE_MQTT_USER=你的 MQTT 用户名
VITE_MQTT_PASS=你的 MQTT 密码
```

## 移动端优化

- ✅ 响应式布局
- ✅ 触摸友好的按钮尺寸
- ✅ 禁用缩放
- ✅ 支持添加到主屏幕
- ✅ 状态栏适配
- ✅ 点击高亮去除

## 浏览器支持

- iOS Safari 12+
- Android Chrome 80+
- 桌面浏览器（现代版本）

## License

MIT
