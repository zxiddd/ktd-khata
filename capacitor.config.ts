import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ktdkhata.app',
  appName: 'ktd khata',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0e8354',
    allowMixedContent: true,
  },
};

export default config;
