# Benedwe AI Frontend

## Authentication Setup

This application uses Firebase Authentication with two sign-in methods:
1. Email and Password
2. Google Sign-In

### Environment Variables

Create a `.env` file in this directory with the following variables:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id

# Google OAuth Client IDs
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
```

### Firebase Authentication Methods

The application supports:
- Email/Password sign-up and sign-in
- Google Sign-In

All authentication is handled through the Firebase JavaScript SDK v9.