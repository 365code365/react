# 阶段一：使用Node镜像构建React应用
FROM node:18 AS builder

# 设置工作目录
WORKDIR /usr/src/app

# 从GitHub拉取React应用代码
RUN git clone https://github.com/365code365/react-plat.git .

RUN npm install -g npm@10.5.2
RUN npm i --save-dev @types/jest --legacy-peer-deps
# 安装依赖
RUN npm install --legacy-peer-deps

# 构建React应用
RUN npm run build

# 阶段二：使用Nginx镜像将构建好的静态文件部署到Nginx中
FROM nginx:latest

# 将第一阶段中构建好的静态文件复制到Nginx的默认静态文件目录中
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# 如果需要，可以添加自定义的Nginx配置文件
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露Nginx的80端口
EXPOSE 80

# Nginx镜像默认会自动启动Nginx，所以无需CMD或ENTRYPOINT命令
