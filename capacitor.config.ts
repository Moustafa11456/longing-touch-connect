
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.619dbd61b0714cf59afa51b41c3a5d7d',
  appName: 'longing-touch-connect',
  webDir: 'dist',
  server: {
    url: 'https://619dbd61-b071-4cf5-9afa-51b41c3a5d7d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "جاري البحث عن الأجهزة...",
        cancel: "إلغاء",
        availableDevices: "الأجهزة المتاحة",
        noDeviceFound: "لم يتم العثور على أجهزة"
      }
    }
  }
};

export default config;
