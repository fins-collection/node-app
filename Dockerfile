# Use the official Node.js 18 base image
FROM node:18

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port your app will run on
EXPOSE 5000

# Set environment variable for production
ENV NODE_ENV=production

# Start the Node.js application
CMD ["node", "server.js"]