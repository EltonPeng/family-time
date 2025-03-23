# Family Time 家庭时光墙

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个重度依赖AI完成的用于家庭照片展示和共享的本地化解决方案：
- [x] 自动照片轮播
- [x] 实时天气显示
- [x] 二维码扫码上传
- [x] 跨设备访问支持
- [ ] 多文件选择上传
- [ ] Todo List

family-time/
- ftfe/    # 前端 (React)
- ftbe/    # 后端 (Node.js)
- readme.md

## 硬件与布署
### 我的debian设备
- 两个USB2.0口，一个插了无线网卡，一个插了外接硬盘，对，没有输入设备了
- 有一个网口但我没用到
- HDMI输出 (后来发现最大只能输出1024*768)
- 18w低功耗

### 准备环境并克隆
1. sudo apt update && sudo apt install -y git nodejs npm
2. git clone https://github.com/EltonPeng/family-time.git ~/family-time
3. cd ~/family-time
4. 不建议直接run deploy.sh脚本，成功率太低了，还是手动执行吧
chmod +x deploy.sh
./deploy.sh

### debian系统上遇到的问题
- [x] 安装了xfce UI
- [x] USB硬盘挂载前可能需要安装ntfs-3g，自动挂载
- [x] 安装firefox
- [x] pm2安装反复失败最终成功
- [x] 调整分辨率失败
- [x] 系统默认一段时间以后断开HDMI输出
- [x] 开机自动登录用户
- [x] 局域网内手机无法访问
- [ ] 开机自动访问前端服务

## 关于配置项
配置项将通过部署脚本自动生成，位于：
- 前端配置： ftfe/.env
- 后端配置： ftbe/.env

| 变量名 | 示例值 | 作用域 | 说明 |
|--------|--------|--------|--------|
| `FE_PORT` | 3000 | 前端 | 服务端口 |
| `BE_PORT` | 3001 | 后端 | 服务端口 |
| `LOCAL_IP` | 192.168.1.100 | 前端/后端 | 本机IP |
| `UPLOAD_DIR` | /mnt/family-time | 后端 | 照片文件夹 |
| `CITY_LAT` | 34.25 | 前端 | 城市纬度 |
| `CITY_LON` | 108.875 | 前端 | 城市经度 |

## 部署更新时的操作
pm2 stop family-time-fe family-time-be
cd ~/family-time
git checkout . && git pull

cd ftfe && npm install && npm run build
cd ../ftbe && npm install
cd ..

pm2 restart family-time-fe family-time-be

欢迎提issue和讨论。
