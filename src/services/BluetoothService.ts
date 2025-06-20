
import { BleClient, BleDevice, numberToUUID } from '@capacitor-community/bluetooth-le';

export interface LongingDevice {
  device: BleDevice;
  name: string;
  rssi?: number;
  isConnected: boolean;
}

class BluetoothService {
  private connectedDevice: BleDevice | null = null;
  private readonly LONGING_SERVICE_UUID = '12345678-1234-5678-9abc-123456789abc';
  private readonly TOUCH_CHARACTERISTIC_UUID = '87654321-4321-8765-cba9-987654321abc';

  async initialize(): Promise<void> {
    try {
      await BleClient.initialize();
      console.log('Bluetooth initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      throw error;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      await BleClient.requestLEScan({
        services: [],
        allowDuplicates: false,
        scanMode: 0
      });
      return true;
    } catch (error) {
      console.error('Bluetooth permissions denied:', error);
      return false;
    }
  }

  async scanForDevices(onDeviceFound: (device: LongingDevice) => void): Promise<void> {
    try {
      const devices: LongingDevice[] = [];
      
      await BleClient.requestLEScan(
        {
          services: [],
          allowDuplicates: false,
          scanMode: 0
        },
        (result) => {
          const existingDevice = devices.find(d => d.device.deviceId === result.device.deviceId);
          if (!existingDevice) {
            const longingDevice: LongingDevice = {
              device: result.device,
              name: result.device.name || `جهاز ${result.device.deviceId.slice(-4)}`,
              rssi: result.rssi,
              isConnected: false
            };
            devices.push(longingDevice);
            onDeviceFound(longingDevice);
          }
        }
      );

      // Stop scanning after 10 seconds
      setTimeout(async () => {
        await this.stopScan();
      }, 10000);
    } catch (error) {
      console.error('Failed to scan for devices:', error);
      throw error;
    }
  }

  async stopScan(): Promise<void> {
    try {
      await BleClient.stopLEScan();
      console.log('Stopped scanning for devices');
    } catch (error) {
      console.error('Failed to stop scanning:', error);
    }
  }

  async connectToDevice(device: BleDevice): Promise<boolean> {
    try {
      await BleClient.connect(device.deviceId);
      this.connectedDevice = device;
      console.log('Connected to device:', device.name);
      return true;
    } catch (error) {
      console.error('Failed to connect to device:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      try {
        await BleClient.disconnect(this.connectedDevice.deviceId);
        this.connectedDevice = null;
        console.log('Disconnected from device');
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  }

  async sendTouch(): Promise<boolean> {
    if (!this.connectedDevice) {
      console.error('No device connected');
      return false;
    }

    try {
      const touchData = new Uint8Array([1]); // Send touch signal
      await BleClient.write(
        this.connectedDevice.deviceId,
        this.LONGING_SERVICE_UUID,
        this.TOUCH_CHARACTERISTIC_UUID,
        touchData
      );
      console.log('Touch sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send touch:', error);
      return false;
    }
  }

  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  getConnectedDevice(): BleDevice | null {
    return this.connectedDevice;
  }
}

export default new BluetoothService();
