# Node.js ka stable version use kar rahe hain
FROM node:18-alpine

# Working directory set kar rahe hain container ke andar
WORKDIR /app

# Dependencies install karne ke liye package files copy kar rahe hain
COPY package*.json ./

# Sabhi dependencies install kar rahe hain
RUN npm install

# Baaki saara backend code copy kar rahe hain
COPY . .

# Port 5000 ko expose kar rahe hain
EXPOSE 5000

# Server ko start karne ki command
CMD ["npm", "start"]
