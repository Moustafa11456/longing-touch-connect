
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

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
  private isNative = false;

  async initialize(): Promise<void> {
    try {
      this.isNative = Capacitor.isNativePlatform();
      
      if (this.isNative) {
        await BleClient.initialize();
        console.log('Bluetooth initialized successfully on native platform');
      } else {
        console.log('Running in browser - Bluetooth features limited');
      }
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      throw error;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (!this.isNative) {
        return true; // Skip permissions in browser
      }
      return true;
    } catch (error) {
      console.error('Bluetooth permissions denied:', error);
      return false;
    }
  }

  async scanForDevices(onDeviceFound: (device: LongingDevice) => void): Promise<void> {
    try {
      const devices: LongingDevice[] = [];
      
      if (!this.isNative) {
        // Demo mode for browser testing
        console.log('Demo mode: Adding simulated devices');
        setTimeout(() => {
          const demoDevices = [
            {
              device: { deviceId: 'demo-1', name: 'جهاز اشتياق تجريبي 1' } as BleDevice,
              name: 'جهاز اشتياق تجريبي 1',
              rssi: -45,
              isConnected: false
            },
            {
              device: { deviceId: 'demo-2', name: 'جهاز اشتياق تجريبي 2' } as BleDevice,
              name: 'جهاز اشتياق تجريبي 2',
              rssi: -67,
              isConnected: false
            }
          ];
          
          demoDevices.forEach(device => {
            devices.push(device);
            onDeviceFound(device);
          });
        }, 1000);
        return;
      }

      await BleClient.requestLEScan(
        {
          services: [],
          allowDuplicates: false,
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
      if (this.isNative) {
        await BleClient.stopLEScan();
      }
      console.log('Stopped scanning for devices');
    } catch (error) {
      console.error('Failed to stop scanning:', error);
    }
  }

  async connectToDevice(device: BleDevice): Promise<boolean> {
    try {
      if (!this.isNative) {
        // Demo connection for browser
        console.log('Demo mode: Simulated connection to', device.name);
        this.connectedDevice = device;
        return true;
      }

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
        if (this.isNative) {
          await BleClient.disconnect(this.connectedDevice.deviceId);
        }
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
      if (!this.isNative) {
        // Demo touch for browser
        console.log('Demo mode: Touch sent successfully');
        return true;
      }

      const touchData = new Uint8Array([1]);
      const dataView = new DataView(touchData.buffer);
      
      await BleClient.write(
        this.connectedDevice.deviceId,
        this.LONGING_SERVICE_UUID,
        this.TOUCH_CHARACTERISTIC_UUID,
        dataView
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

  isRunningNative(): boolean {
    return this.isNative;
  }
}

export default new BluetoothService();
