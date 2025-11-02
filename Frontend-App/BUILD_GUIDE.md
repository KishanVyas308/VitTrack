# Building AAB for Play Store - VitTrack

## Prerequisites

1. **Install EAS CLI globally**
   ```bash
   npm install -g eas-cli
   ```

2. **Create an Expo account** (if you don't have one)
   - Go to https://expo.dev and sign up
   - Or run `eas login` and follow the prompts

## Step-by-Step Build Process

### 1. Navigate to Frontend-App directory
```bash
cd /Users/kishan/All-Project/Freelance/VitTrack/Frontend-App
```

### 2. Login to Expo/EAS
```bash
eas login
```
Enter your Expo credentials.

### 3. Configure your project
```bash
eas build:configure
```
This will set up your project for EAS Build (already done - `eas.json` is created).

### 4. Generate Android Keystore (First time only)
When you run the build command, EAS will ask if you want to generate a new keystore. Choose **Yes** and let EAS manage it for you.

Alternatively, if you want to use your own keystore:
```bash
eas credentials
```

### 5. Build the AAB for Production
```bash
eas build --platform android --profile production
```

**What happens:**
- EAS will upload only your Frontend-App code (Backend is excluded via `.easignore`)
- Build happens on EAS servers (remote build)
- Takes 5-15 minutes typically
- You'll get a download link when complete

### 6. Monitor the build
You can track progress at:
- In terminal (shows real-time logs)
- Expo dashboard: https://expo.dev/accounts/[your-account]/projects/vittrack/builds

### 7. Download the AAB
Once build completes:
```bash
# The terminal will show a download URL
# Or visit: https://expo.dev/accounts/[your-account]/projects/vittrack/builds
```

Download the `.aab` file to your computer.

## Alternative: Local Build (if you prefer)

If you want to build locally without sending code to EAS servers:

### 1. Build locally
```bash
eas build --platform android --profile production --local
```

**Requirements for local build:**
- Docker must be installed
- More disk space needed (~10GB)
- Slower first build (downloads Android SDK)

## Upload to Play Store

### Option A: Manual Upload
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (or create new app)
3. Go to **Release > Production > Create new release**
4. Upload the `.aab` file
5. Fill in release notes and submit

### Option B: Using EAS Submit (Automated)
```bash
eas submit --platform android
```

You'll need:
- Google Service Account JSON key
- Or you can upload manually as shown in Option A

## Important Configuration Files Created

1. **eas.json** - Build profiles configuration
   - `development`: For internal testing (APK)
   - `preview`: For preview builds (APK)
   - `production`: For Play Store (AAB)

2. **.easignore** - Excludes Backend folder from upload
   - Prevents Backend code from being sent to EAS servers
   - Reduces upload size and build time

3. **app.json** - Updated with:
   - App name: "VitTrack"
   - Package name: `com.vittrack.app`
   - Version code: 1
   - Required permissions (RECORD_AUDIO for voice input)

## Build Profiles Explained

### Production Profile (for Play Store)
```bash
eas build --platform android --profile production
```
- Creates `.aab` (Android App Bundle)
- Optimized and minified
- Ready for Play Store

### Preview Profile (for testing)
```bash
eas build --platform android --profile preview
```
- Creates `.apk` (easier to share with testers)
- Can install directly on devices

## Cost & Limits

- **Expo Free Tier**: 15 builds/month (shared across all projects)
- **Paid Plans**: Unlimited builds
- **Local builds**: Free (unlimited) but requires Docker

## Troubleshooting

### Build fails with "Archive too large"
Solution: Already handled via `.easignore` excluding Backend

### "No bundle identifier" error
Solution: Already added `android.package` in `app.json`

### "Gradle build failed"
Check:
- All dependencies in `package.json` are compatible
- No conflicting native modules
- Check build logs on Expo dashboard

### Backend not accessible after build
- Make sure your API_CONFIG.BASE_URL in `config/api.ts` points to your production backend
- Update the IP address to your deployed backend URL before building

## Update Backend URL for Production

Before building for production, update the backend URL:

**File:** `Frontend-App/config/api.ts`
```typescript
export const API_CONFIG = {
  // For production, use your deployed backend URL
  BASE_URL: 'https://your-backend-domain.com',
  // Or keep localhost for development: 'http://192.168.0.100:8000'
};
```

## Next Steps After Build

1. **Test the AAB**
   - Use Google Play Console's internal testing track
   - Upload and create internal test release first

2. **Prepare Play Store Listing**
   - Screenshots (required)
   - App description
   - Privacy policy URL
   - Target audience and content rating

3. **App Review**
   - First review takes 3-7 days
   - Updates are usually faster (1-3 days)

## Quick Reference Commands

```bash
# Login
eas login

# Build AAB for Play Store
eas build --platform android --profile production

# Build APK for testing
eas build --platform android --profile preview

# Check build status
eas build:list

# View credentials
eas credentials

# Submit to Play Store
eas submit --platform android
```

## Security Notes

- Backend folder is excluded from EAS upload
- Keystore is securely managed by EAS (or you can manage your own)
- Environment variables can be added via `eas.json` or Expo dashboard
- Never commit sensitive keys to git

## Support

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Expo Forums: https://forums.expo.dev/
- Discord: https://chat.expo.dev/
