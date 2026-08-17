FROM node:22-alpine AS build

ARG VITE_API_URL
ARG VITE_FRONTEND_URL
ARG VITE_HOME_URL                  


ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL
ENV VITE_HOME_URL=$VITE_HOME_URL     
WORKDIR /frontend-auth
ADD . /frontend-auth/
RUN npm install && npm run build
FROM nginx:alpine AS runtime
COPY --from=build /frontend-auth/dist /usr/share/nginx/html
EXPOSE 80