# iOS Custom Development Build Guide

This guide walks you through developing your React Native Expo app with `@react-native-firebase` using a custom development build instead of Expo Go.

## Prerequisites

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to your Expo account**:
   ```bash
   eas login
   ```

3. **Ensure you have Xcode installed** (for iOS simulator) or a physical iOS device

## Step 1: Configure EAS Build

Create an `eas.json` file in your project root (if it doesn't exist):

```bash
eas build:configure
```

This will create an `eas.json` file. For development builds, ensure it includes a `development` profile:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Step 2: Build the iOS Development Client

### Option A: Build for iOS Simulator (Recommended for Development)

```bash
eas build --profile development --platform ios
```

When prompted:
- Choose **"Build for iOS simulator"** if you want to test on a simulator
- Choose **"Build for physical device"** if you want to test on a real device

**Note**: Simulator builds are faster and don't require an Apple Developer account. Physical device builds require an Apple Developer account and may take longer.

### Option B: Build Locally (Faster Iteration)

If you have Xcode and want faster builds, you can build locally:

```bash
eas build --profile development --platform ios --local
```

**Requirements for local builds**:
- Xcode installed
- CocoaPods installed: `sudo gem install cocoapods`
- Run `cd ios && pod install` (if you have an `ios` folder)

## Step 3: Install the Development Build

### For iOS Simulator:

1. **Download the build**:
   - After the build completes, EAS will provide a download link
   - Or find it in your Expo dashboard: https://expo.dev/accounts/[your-account]/projects/[your-project]/builds

2. **Install on simulator**:
   ```bash
   # List available simulators
   xcrun simctl list devices available

   # Install the .app file (replace with your simulator UDID and .app path)
   xcrun simctl install <SIMULATOR_UDID> <PATH_TO_APP.app>
   
   # Or simply drag and drop the .app file onto the simulator
   ```

3. **Launch the simulator**:
   ```bash
   # Open Xcode and start a simulator, or use:
   open -a Simulator
   ```

### For Physical iOS Device:

1. **Download the build** from EAS (it will be a `.ipa` file)

2. **Install via TestFlight** (recommended):
   - Upload the build to App Store Connect
   - Add testers in TestFlight
   - Install via TestFlight app on your device

3. **Install via direct download**:
   - Download the `.ipa` file
   - Use Apple Configurator 2 or Xcode to install
   - Or use a service like Diawi for easier installation

## Step 4: Start the Metro Bundler

In your project root directory, start the Metro bundler:

```bash
npm start
# or
expo start
```

**Important**: The Metro bundler must be running for your app to load JavaScript code. Keep this terminal window open.

You should see output like:
```
Metro waiting on exp://192.168.1.x:8081
```

## Step 5: Connect Your Development Build to Metro

### On iOS Simulator:

1. **Open the development build app** you installed on the simulator
2. The app should automatically connect to the Metro bundler if:
   - The simulator and your computer are on the same network
   - Metro is running on your local machine
3. If it doesn't connect automatically, you may see a connection screen where you can:
   - Scan a QR code (if Metro shows one)
   - Enter the connection URL manually (e.g., `exp://192.168.1.x:8081`)

### On Physical iOS Device:

1. **Ensure your device and computer are on the same Wi-Fi network**
2. **Open the development build app** on your device
3. **Connect to Metro**:
   - If you see a connection screen, enter the Metro URL shown in your terminal
   - The URL format is: `exp://YOUR_LOCAL_IP:8081`
   - You can find your local IP by running:
     ```bash
     # macOS/Linux
     ifconfig | grep "inet " | grep -v 127.0.0.1
     
     # Or check the Metro bundler output - it shows the IP
     ```

## Step 6: Development Workflow

Once connected:

1. **Make code changes** in your JavaScript/TypeScript files
2. **Save the file** - Metro will automatically reload (Fast Refresh)
3. **Shake your device** (or press `Cmd+D` on simulator) to open the developer menu
4. **Reload manually** if needed: Press `r` in the Metro terminal or use the developer menu

### Useful Metro Commands:

- `r` - Reload the app
- `m` - Toggle menu
- `d` - Open developer menu
- `j` - Open debugger
- `Ctrl+C` - Stop Metro bundler

## Troubleshooting

### App Won't Connect to Metro

1. **Check network connection**:
   - Ensure device/simulator and computer are on the same network
   - Try disabling VPN if active

2. **Check Metro is running**:
   - Verify Metro bundler is running in terminal
   - Look for the connection URL in Metro output

3. **Clear Metro cache**:
   ```bash
   npm start -- --clear
   # or
   expo start --clear
   ```

4. **Manually enter connection URL**:
   - In the development build app, manually enter: `exp://YOUR_LOCAL_IP:8081`

### Build Issues

1. **"No development build found"**:
   - Ensure you built with `--profile development`
   - Check that `developmentClient: true` is in your `eas.json`

2. **Firebase not working**:
   - Verify `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are in the root directory
   - Rebuild the development client after adding Firebase config files

3. **Native module errors**:
   - After adding new native dependencies, rebuild the development client:
     ```bash
     eas build --profile development --platform ios
     ```

### Simulator-Specific Issues

1. **App not appearing in simulator**:
   ```bash
   # List installed apps
   xcrun simctl listapps <SIMULATOR_UDID>
   
   # Boot simulator if not running
   xcrun simctl boot <SIMULATOR_UDID>
   ```

2. **Reset simulator** (if app is behaving strangely):
   ```bash
   xcrun simctl erase <SIMULATOR_UDID>
   ```

### Device-Specific Issues

1. **"Untrusted Developer" error**:
   - Go to Settings > General > VPN & Device Management
   - Trust your developer certificate

2. **App crashes on launch**:
   - Check device logs in Xcode: Window > Devices and Simulators > Select device > View Device Logs
   - Ensure Firebase config files are correctly placed

## Quick Reference Commands

```bash
# Build development client for simulator
eas build --profile development --platform ios

# Start Metro bundler
npm start

# Start Metro with cleared cache
npm start -- --clear

# Check EAS build status
eas build:list

# View build details
eas build:view [BUILD_ID]
```

## Important Reminders

1. **Always keep Metro bundler running** - Your app needs it to load JavaScript
2. **Rebuild the development client** when you:
   - Add new native dependencies (like Firebase modules)
   - Change native configuration (app.json iOS/Android settings)
   - Update Expo SDK version
3. **JavaScript changes** don't require a rebuild - Metro handles those with Fast Refresh
4. **Native code changes** require a rebuild of the development client
5. **Firebase config files** must be in the project root before building

## Next Steps

- For production builds: `eas build --profile production --platform ios`
- For Android development builds: `eas build --profile development --platform android`
- Learn more: https://docs.expo.dev/development/introduction/



