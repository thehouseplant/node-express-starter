# Import lightweight Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the project with tsc
RUN npm run build

# Expose the server port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
