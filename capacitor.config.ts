
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.619dbd61b0714cf59afa51b41c3a5d7d',
  appName: 'longing-touch-connect',
  webDir: 'dist',
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
