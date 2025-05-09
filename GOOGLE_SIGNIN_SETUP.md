# Google Sign-In Setup for SnapQuest

This document explains how to set up Google Sign-In for the SnapQuest mobile app.

## 1. Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Navigate to Project Settings (gear icon) > General
4. Copy the Firebase configuration values to your `.env` file:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

## 2. Google Sign-In Setup

### Web Configuration (Required for Android)

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable Google as a sign-in method
3. Under the Google provider, note your Web Client ID
4. Add it to your `.env` file:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
   ```

### iOS Configuration

1. Go to Firebase Console > Authentication > Sign-in method > Google
2. Add your iOS bundle ID (`com.snapquest.app`)
3. Download the GoogleService-Info.plist file and place it in your project root
4. Add the iOS Client ID to your `.env` file:
   ```
   EXPO_PUBLIC_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
   ```

### Android Configuration

1. Go to Firebase Console > Project Settings > Your Apps > Add App > Android
2. Register the app with package name `com.snapquest.app`
3. Download the google-services.json file and place it in your project root

## 3. Development Build

To use Google Sign-In, you need to build a development client:

```
eas build --platform android --profile development
```

Once the build is complete, install the APK on your device and run:

```
npx expo start --dev-client
```

## Troubleshooting

If you encounter any issues:

1. Make sure all environment variables are correctly set in `.env`
2. Verify your Firebase configuration in the Firebase console
3. Check that the google-services.json and GoogleService-Info.plist files are correctly placed
4. Use a development build instead of Expo Go, as Google Sign-In requires native modules 