# 第一阶段：构建React应用
FROM node:18 AS builder

WORKDIR /app

# 设置时区
ENV TZ="Asia/Shanghai"

# 更新软件包索引并安装git
RUN apt-get update && apt-get install -y git

# 克隆GitHub项目
RUN git clone https://github.com/365code365/react-plat.git .

# 安装依赖项
# Install npm globally and dependencies
RUN npm install -g npm@10.5.2
RUN npm i --save-dev @types/jest --legacy-peer-deps
# 安装依赖
RUN npm install --legacy-peer-deps

# 构建React应用
# Build the React application
RUN npm run build
# 第二阶段：构建Nginx服务器
FROM nginx:latest

# 复制构建后的React应用到Nginx默认服务目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义的Nginx配置文件到容器中
COPY config/nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
