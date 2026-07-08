FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose port (matching PORT in .env)
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
