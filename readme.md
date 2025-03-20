#### **0 precondition**
设备通过网线连接路由器，手机通过Wi-Fi连接同一路由器。

#### **1 路由器配置**
- 需确保路由器的“客户端隔离”功能已关闭（否则设备间无法互通）。
- 检查路由器是否启用“AP隔离“， 需关闭此功能。
- 路由器后台为设备MAC地址分配静态IP地址。如 192.168.1.100

#### **2 防火墙**
确保设备防火墙放行端口 8089：
```bash
# Linux（ufw）
sudo ufw allow 8089/tcp

# Linux（iptables）
sudo iptables -A INPUT -p tcp --dport 8089 -j ACCEPT
```
#### **3 服务器配置与检查**
- 查看服务进程绑定情况：
```bash
# Linux
netstat -tuln | grep 8089

# 期望输出：
# tcp  0  0 0.0.0.0:8089    0.0.0.0:*    LISTEN
```
- 获取设备在局域网中的IP地址
```bash
# Linux
hostname -I   # 显示所有IP地址（如192.168.1.100）
```
得到的IP地址即为从手机访问的网页host部分，比如 http://192.168.1.100:8089

#### **4 外部检查**
- 验证服务可达性：在台式机上执行 curl http://192.168.1.100:8089


// 配置上传路径（外接硬盘）
const upload = multer({ dest: '/mnt/usb/images' });

// Node.js示例（使用express-basic-auth）
app.use(basicAuth({ users: { 'admin': '223355' } }));

# 安装基础依赖
