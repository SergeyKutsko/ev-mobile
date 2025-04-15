<img src="https://user-images.githubusercontent.com/32574035/193282473-32e9490b-3d03-4826-a819-872b6c2a0898.png" alt="drawing" width="200"/>

# Open e-Mobility React-Native Mobile App

## Required Versions & Tools 🛠

- Node.js: 18.20.7 (via nvm)
- React Native CLI: 0.70.8
- Ruby: 2.7.5
- Xcode: 16.2
- Firebase: 16.4.5
- Android SDK: 33
- Package Manager: yarn

## Installation Steps 📥

### 1. Environment Setup
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node
nvm install 18.20.7
nvm use 18.20.7

# Install yarn
npm install -g yarn

2. Project Setup
# Clone repository
git clone <repository-url>
cd ev-mobile

# Install dependencies
yarn

# Install pods
cd ios
pod install
cd ..

# Start Metro
yarn start

# In new terminal for iOS
yarn ios

Running the App 🚀
iOS

# Install pods
cd ios
pod install
cd ..

# Start Metro
yarn start

# In new terminal for iOS
yarn ios

Important iOS Note ⚠️
Open ios/YourProject.xcworkspace in Xcode
If error appears: hover → scroll down → click "Fix"
Build project (Command + B)

Android:
# Start Metro
yarn start

# In new terminal
yarn android

Troubleshooting 🔧
iOS Issues

# Clean and reinstall pods
cd ios
pod deintegrate
pod install
cd ..

# Clear cache
yarn start --reset-cache

Android Issues
# Clean Gradle
cd android
./gradlew clean
cd ..

# Reset Metro cache
yarn start --reset-cache

Environment Requirements
iOS:
Xcode 16.2
iOS Simulator
CocoaPods

Android:
Android Studio
SDK 33
Configured emulator


Useful Commands 🛠
# Check versions
node -v
yarn -v
react-native --version

# Clear watchman
watchman watch-del-all

Backend
Connected to Open e-Mobility backend: https://github.com/sap-labs-france/ev-server

## License

This file and all other files in this repository are licensed under the Apache Software License, v.2 and copyrighted under the copyright in [NOTICE](NOTICE) file, except as noted otherwise in the [LICENSE](LICENSE) file.

Please note that the mobile application can contain other software which may be licensed under different licenses.

# Learning Outcomes 📚

Through this React Native project, I gained experience in:

## Development Skills
- React Native cross-platform mobile development
- TypeScript implementation in mobile apps
- Firebase integration and authentication flows
- OTP verification system implementation
- Native module bridging for iOS and Android

## Development Tools
- Version control with Git
- Package management with yarn
- iOS development with Xcode
- Android development with Android Studio
- Terminal command line usage

## Mobile Development Concepts
- Mobile app navigation architecture
- State management in React Native
- Platform-specific code management
- Mobile UI/UX best practices
- App deployment processes

## Technical Skills
- Setting up development environments
- Managing dependencies with CocoaPods
- Android SDK and Gradle configuration
- iOS build process and signing
- Debugging mobile applications

## Project Management
- Version control workflows
- Project documentation
- Development environment setup
- Cross-platform compatibility
- Mobile app testing strategies

This project provided hands-on experience with modern mobile development tools, frameworks, and best practices while building a production-ready application.