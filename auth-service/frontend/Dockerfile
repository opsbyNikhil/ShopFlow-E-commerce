FROM node:22-alpine AS build

ARG VITE_API_URL
ARG VITE_FRONTEND_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

WORKDIR /auth-frontend
ADD . /auth-frontend/
RUN npm install && npm run build
FROM nginx:alpine AS runtime
COPY --from=build /auth-frontend/dist /usr/share/nginx/html
EXPOSE 80
