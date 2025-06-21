# Import lightweight Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production --silent && npm cache clean --force

# Copy source code
COPY . .

# Build the project with tsc
RUN npm run build

# Copy PM2 configuration file
COPY ecosystem.config.js ./

# Expose the server port
EXPOSE 3000

# Start the application
CMD ["pm2-runtime", "ecosystem.config.js"]
