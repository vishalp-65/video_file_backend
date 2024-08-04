# Use the official lightweight Node.js image with Alpine
FROM node:20-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port (adjust this if your app uses a different port)
EXPOSE 8000

# Start the application
CMD ["npm", "run", "dev"]
