
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.358546c2eb044431870429e02d902c18',
  appName: 'smart-spend-pwa',
  webDir: 'dist',
  server: {
    url: 'https://358546c2-eb04-4431-8704-29e02d902c18.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: "always"
  }
};

export default config;
