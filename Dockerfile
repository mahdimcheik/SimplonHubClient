FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM build AS production
COPY . .
RUN npm run build:prod


FROM nginx:alpine as prod-runtime
COPY --from=production /app/dist/skill-hive/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

