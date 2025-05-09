# Photty Mobile

Mobile application for Photty, built with React Native and Expo.

## Features

- Photo-based quest completion
- User authentication with Firebase
- Google Sign-In integration
- Real-time notifications
- Location-based quests

## Tech Stack

- React Native
- Expo
- Firebase Authentication
- React Navigation
- Expo Location

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Firebase project
- Android Studio or Xcode for app development

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Photty/photty-mobile.git
cd photty-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
```

4. Start the development server:
```bash
npm start
```

### Development Build

To test Google Sign-In functionality, you need to create a development build:

```bash
eas build --platform android --profile development
```

Once the build is complete, install the APK on your device and run:

```bash
npx expo start --dev-client
```

## Project Structure

```
photty-mobile/
├── app/                  # Expo Router files
│   ├── (tabs)/           # Tab navigation
│   │   ├── index.tsx     # Home screen
│   │   └── explore.tsx   # Explore screen
│   └── _layout.tsx       # Main layout
├── components/           # Reusable components
├── context/              # Context providers
├── screens/              # Screen components
├── utils/                # Utility functions
├── assets/               # Images, fonts, etc.
└── App.js                # Entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request
