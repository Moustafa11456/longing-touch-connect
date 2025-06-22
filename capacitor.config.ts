
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.longingtouch',
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
