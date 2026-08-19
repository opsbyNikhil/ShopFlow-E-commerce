FROM node:22-alpine AS build

ARG VITE_API_URL
ARG VITE_FRONTEND_URL
ARG VITE_PRODUCT_FRONTEND_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL
ENV VITE_PRODUCT_FRONTEND_URL=$VITE_PRODUCT_FRONTEND_URL

WORKDIR /frontend-home
ADD . /frontend-home/
RUN npm install && npm run build
FROM nginx:alpine AS runtime
COPY --from=build /frontend-home/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
