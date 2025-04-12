FROM node:20-alpine as builder
WORKDIR /frontend
COPY package.json .
RUN npm install
COPY . .
RUN npm run buildNoTS

FROM nginx:1.27.1-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY static.conf /etc/nginx/conf.d
COPY --from=builder /frontend/dist .
