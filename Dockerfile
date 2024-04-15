# Stage one: Use Node image to build the React application
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Clone React application code from GitHub
RUN git clone https://github.com/365code365/react-plat.git .

# Install npm globally and dependencies
RUN npm install -g npm@10.5.2
RUN npm i --save-dev @types/jest --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Build the React application
RUN npm run build

# Stage two: Use Nginx image to deploy built static files to Nginx
FROM nginx:latest

# Copy the built static files from the first stage to Nginx's default static file directory
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy the Nginx configuration file from the config folder to the Nginx image
COPY config/nginx.conf /etc/nginx/nginx.conf

# Expose Nginx's port 80
EXPOSE 80

# Nginx image automatically starts Nginx, so no CMD or ENTRYPOINT command is required
