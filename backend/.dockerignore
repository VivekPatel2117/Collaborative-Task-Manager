# 1️⃣ Base image
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Install dependencies
COPY package*.json ./
RUN npm install

# 4️⃣ Copy source code
COPY . .

# 5️⃣ Generate Prisma client
RUN npx prisma generate

# 6️⃣ Build TypeScript
RUN npm run build

# 7️⃣ Expose backend port
EXPOSE 5000

# 8️⃣ Start server
CMD ["npm", "run", "start"]
