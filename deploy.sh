#!/bin/bash
echo "配置npm镜像源..."
npm config set registry https://registry.npmmirror.com
npm config set disturl https://npmmirror.com/dist
npm config set puppeteer_download_host https://cdn.npmmirror.com

echo "安装PM2（允许重试）..."
export NODE_TLS_REJECT_UNAUTHORIZED=0
npm install -g pm2 --loglevel=error --retry 5 --fetch-retry-maxtimeout 30000


sudo sysctl -w net.core.somaxconn=65535
sudo sysctl -w net.ipv4.tcp_max_syn_backlog=65535 
sudo sysctl -w net.ipv4.ip_local_port_range="1024 65535"


DETECTED_IP=$(hostname -I | awk '{print $1}')

read -p "检测到本机IP为 ${DETECTED_IP} 是否正确？[Y/n] " CONFIRM
if [[ $CONFIRM =~ ^[Nn]$ ]]; then
    read -p "请输入正确的本机IP地址: " IP
else
    IP=$DETECTED_IP
fi

IP=${IP}

read -p "请输入前端端口（默认：3000）: " FE_PORT
FE_PORT=${FE_PORT:-3000}

read -p "请输入后端端口（默认：3001）: " BE_PORT
BE_PORT=${BE_PORT:-3001}

read -p "请输入纬度（默认：34.25）: " LAT
LAT=${LAT:-34.25}

read -p "请输入经度（默认：108.875）: " LON
LON=${LON:-108.875}

read -rp "请输入照片保存全路径（默认使用ftbe\uploads，不推荐）: " UPLOAD_DIR
UPLOAD_DIR=${UPLOAD_DIR}

# 生成前端环境文件
cat > ftfe/.env <<EOF
REACT_APP_FE_PORT=${FE_PORT}
REACT_APP_BE_PORT=${BE_PORT}
REACT_APP_LOCAL_IP=${IP}
REACT_APP_CITY_LAT=${LAT}
REACT_APP_CITY_LON=${LON}
EOF

# 生成后端环境文件
cat > ftbe/.env <<EOF
FE_PORT=${FE_PORT}
BE_PORT=${BE_PORT}
LOCAL_IP=${IP}
UPLOAD_DIR="${UPLOAD_DIR//\\/\\\\}"

EOF

echo "配置完成！"

echo "开始安装依赖..."
cd ftfe && npm install && npm run build
cd ../ftbe && npm install

echo "创建上传目录：${UPLOAD_DIR}"
mkdir -p "${UPLOAD_DIR//\\/\\\\}"
sudo chown -R $USER:$USER "${UPLOAD_DIR//\\/\\\\}"

echo "启动服务..."
pm2 start "serve -s ../ftfe/build -l ${FE_PORT} --host 0.0.0.0" --name "family-time-fe"
pm2 start "node -r dotenv/config server.js" --name "family-time-be"
pm2 save && pm2 startup

echo "部署完成！访问地址：http://${IP}:${FE_PORT}"
echo "服务状态："
pm2 list