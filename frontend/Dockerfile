# # Stage 1: Build stage
FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

ENV VITE_APP_BACKEND_URL=http://3.76.113.233/backend

COPY . .

RUN npm run build

# Stage 2: Production stage
FROM nginx:latest

RUN apt-get update && \
    apt-get install -y certbot python3-certbot-nginx && \
    apt-get clean

COPY nginx.conf /etc/nginx/nginx.conf

# RUN rm -rf ./*

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443 3000

CMD ["nginx", "-g", "daemon off;"]