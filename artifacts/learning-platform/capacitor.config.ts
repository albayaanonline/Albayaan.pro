interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
    allowNavigation?: string[];
    cleartext?: boolean;
  };
  android?: {
    allowMixedContent?: boolean;
    captureInput?: boolean;
    webContentsDebuggingEnabled?: boolean;
  };
  plugins?: Record<string, Record<string, unknown>>;
}

const config: CapacitorConfig = {
  appId:   "com.albayaan.app",
  appName: "Albayaan",
  webDir:  "dist",
  server: {
    androidScheme: "https",
    allowNavigation: ["*.albayaan.pro", "fonts.gstatic.com"],
    cleartext: false,
  },
  android: {
    allowMixedContent:          false,
    captureInput:               true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration:        2000,
      launchAutoHide:            true,
      backgroundColor:           "#0a0f24",
      androidSplashResourceName: "splash",
      showSpinner:               false,
    },
  },
};

export default config;
