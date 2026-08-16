FROM node:22-alpine AS build
WORKDIR /auth-frontend
ADD . /auth-frontend/
RUN npm install && npm run build
FROM nginx:alpine AS runtime
COPY --from=build /auth-frontend/dist /usr/share/nginx/html
EXPOSE 80
