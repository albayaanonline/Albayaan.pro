import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ilmai.app",
  appName: "IlmAI",
  webDir: "dist/public",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
    allowNavigation: ["*.ilmai.app", "*.googleapis.com", "fonts.gstatic.com"],
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0a0f24",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
  },
};

export default config;
