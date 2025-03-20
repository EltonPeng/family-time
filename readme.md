# Family Time 家庭时光墙

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个用于家庭照片展示和共享的本地化解决方案，包含以下功能：
[x] 自动照片轮播
[x] 实时天气显示
[x] 二维码扫码上传
[x] 跨设备访问支持
[] Todo List

family-time/
├── ftfe/    # 前端 (React)
├── ftbe/    # 后端 (Node.js)
└── readme.md

## 配置指南

### 必需配置项
| 变量名 | 示例值 | 作用域 | 说明 |
|--------|--------|--------|--------|
| `FE_PORT` | 3000 | 前端 | 服务端口 |
| `BE_PORT` | 3001 | 后端 | 服务端口 |
| `LOCAL_IP` | 192.168.1.100 | 前端/后端 | 本机IP |
| `UPLOAD_DIR` | /mnt/family-time | 后端 | 照片文件夹 |
| `CITY_LAT` | 34.25 | 前端 | 城市纬度 |
| `CITY_LON` | 108.875 | 前端 | 城市经度 |

这个项目是在AI的帮助下写的，欢迎提issue。
