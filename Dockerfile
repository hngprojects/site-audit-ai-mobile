# Use a suitable base image with Node.js and potentially Android SDK
FROM ubuntu:22.04

# Install necessary packages and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    openjdk-17-jdk \
    unzip \
    # Add other dependencies as needed for your project

# Install Node.js and npm (if not included in base image)
# Example for installing Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Expo CLI globally
RUN npm install -g expo-cli

# Install Android SDK
RUN mkdir -p /opt/android-sdk/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O /tmp/android-sdk.zip && \
    unzip -q /tmp/android-sdk.zip -d /opt/android-sdk/cmdline-tools && \
    mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/latest && \
    rm /tmp/android-sdk.zip

ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Accept Android SDK licenses
RUN yes | sdkmanager --licenses

# Install Android SDK components
RUN sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"

# Set the working directory inside the container
WORKDIR /app

# Copy your Expo project files into the container
COPY . .

# Install project dependencies
RUN npm install

# Prebuild for Android
RUN npx expo prebuild --platform android

# Build APK
RUN cd android && ./gradlew assembleRelease

# Define the command to run when the container starts (optional, for development)
# CMD ["npx", "expo", "start"]