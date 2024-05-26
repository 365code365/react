# 第一阶段：构建React应用
FROM node:18 AS builder

WORKDIR /app

# 设置时区
ENV TZ="Asia/Shanghai"

## 更新软件包索引并安装git
#RUN yum -y update && \
#    yum -y install git && \
#    yum clean all

# 克隆GitHub项目
RUN git clone https://github.com/365code365/react-plat.git .

# 安装依赖项
RUN npm install -g npm@10.5.2 && \
    npm i --save-dev @types/jest --legacy-peer-deps && \
    npm install --legacy-peer-deps && \
    npm run build

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
