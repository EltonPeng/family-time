# Family Time 家庭时光墙

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个重度依赖AI完成的用于家庭照片展示和共享的本地化解决方案：
- [x] 自动照片轮播
- [x] 实时天气显示
- [x] 二维码扫码上传
- [x] 跨设备访问支持
- [ ] Todo List

family-time/
- ftfe/    # 前端 (React)
- ftbe/    # 后端 (Node.js)
- readme.md

## 在新的debian设备上安装
### 准备环境并克隆
1. sudo apt update && sudo apt install -y git nodejs npm
2. git clone https://github.com/EltonPeng/family-time.git ~/family-time
3. cd ~/family-time
4. 不建议直接run deploy.sh脚本，成功率太低了，还是手动执行吧
chmod +x deploy.sh
./deploy.sh

### debian系统上遇到的问题
0. 安装了xfce UI
1. USB硬盘挂载前可能需要安装ntfs-3g
2. 可能需要安装firefox
3. pm2安装 

## 其他系统安装
1. 请参考上一节中git clone的部分, 
2. deploy.sh文件中可能需要做较大调整。

## 必需配置项

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
