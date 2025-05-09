#!/bin/bash

echo "Rebuilding Android development build..."

# Clean the Android build directory
echo "Cleaning Android build directory..."
cd android
./gradlew clean
cd ..

# Clear EAS cache
echo "Clearing EAS cache..."
rm -rf .eas-cache

# Build the development client again
echo "Starting EAS build for Android..."
eas build --platform android --profile development

echo "Build process initiated. Check the EAS dashboard for progress." 