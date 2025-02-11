FROM node:20.11.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable

COPY --from=build /app/dist/clash-frontend/browser /usr/share/nginx/html

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80/tcp

EXPOSE 443/tcp