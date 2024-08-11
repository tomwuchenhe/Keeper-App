# Step 1: Build the application
FROM node:16-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
