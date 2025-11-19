# Use a suitable base image with Node.js and potentially Android SDK
FROM ubuntu:22.04

# Install necessary packages and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    openjdk-17-jdk \
    # Add other dependencies as needed for your project

# Install Node.js and npm (if not included in base image)
# Example for installing Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Expo CLI globally
RUN npm install -g expo-cli

# Set the working directory inside the container
WORKDIR /app

# Copy your Expo project files into the container
COPY . .

# Install project dependencies
RUN npm install

# Define the command to run when the container starts (optional, for development)
# CMD ["npx", "expo", "start"]