# Build Stage: Use Node 18.12.1
FROM node:18.12.1-alpine as builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Serve with Nginx
FROM nginx:alpine

# Copy built frontend from builder to Nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for browser
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
