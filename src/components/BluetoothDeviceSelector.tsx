import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bluetooth, Loader2, Smartphone, WifiOff, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BluetoothService, { LongingDevice } from "@/services/BluetoothService";

interface BluetoothDeviceSelectorProps {
  onDeviceConnected: (device: LongingDevice) => void;
  onDisconnected: () => void;
}

const BluetoothDeviceSelector = ({ onDeviceConnected, onDisconnected }: BluetoothDeviceSelectorProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<LongingDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<LongingDevice | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeBluetooth();
  }, []);

  const initializeBluetooth = async () => {
    try {
      await BluetoothService.initialize();
      setIsNative(BluetoothService.isRunningNative());
      const hasPermissions = await BluetoothService.requestPermissions();
      
      if (hasPermissions) {
        setIsInitialized(true);
        if (!BluetoothService.isRunningNative()) {
          toast({
            title: "وضع تجريبي",
            description: "التطبيق يعمل في المتصفح - ستظهر أجهزة تجريبية للاختبار",
          });
        } else {
          toast({
            title: "تم تفعيل البلوتوث",
            description: "يمكنك الآن البحث عن الأجهزة القريبة",
          });
        }
      } else {
        toast({
          title: "تحتاج صلاحيات البلوتوث",
          description: "يرجى منح التطبيق صلاحيات البلوتوث من إعدادات الجهاز",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في تفعيل البلوتوث",
        description: "تأكد من تفعيل البلوتوث في جهازك",
        variant: "destructive",
      });
    }
  };

  const startScanning = async () => {
    if (!isInitialized) {
      await initializeBluetooth();
      return;
    }

    setIsScanning(true);
    setDevices([]);

    // قائمة مؤقتة للاحتفاظ بالأجهزة الممسوحة داخل الدالة
    const foundDevices: LongingDevice[] = [];

    try {
      await BluetoothService.scanForDevices((device) => {
        setDevices(prev => {
          const exists = prev.find(d => d.device.deviceId === device.device.deviceId);
          if (!exists) {
            foundDevices.push(device);
            return [...prev, device];
          }
          return prev;
        });
      });

      toast({
        title: "جاري البحث",
        description: isNative ? "البحث عن أجهزة الاشتياق القريبة..." : "إضافة أجهزة تجريبية للاختبار...",
      });

      // إيقاف البحث بعد 10 ثواني وتحقق من وجود أجهزة
      setTimeout(() => {
        setIsScanning(false);
        if (foundDevices.length === 0 && isNative) {
          toast({
            title: "لم يتم العثور على أجهزة",
            description: "تأكد من تشغيل جهاز الاشتياق وقربه منك",
          });
        }
      }, 10000);

    } catch (error) {
      setIsScanning(false);
      toast({
        title: "خطأ في البحث",
        description: "فشل في البحث عن الأجهزة",
        variant: "destructive",
      });
    }
  };

  const connectToDevice = async (device: LongingDevice) => {
    try {
      const success = await BluetoothService.connectToDevice(device.device);
      
      if (success) {
        const connectedDeviceData = { ...device, isConnected: true };
        setConnectedDevice(connectedDeviceData);
        onDeviceConnected(connectedDeviceData);
        
        toast({
          title: "تم الاتصال بنجاح",
          description: `تم الاتصال بـ ${device.name}`,
        });
      } else {
        toast({
          title: "فشل الاتصال",
          description: "لم يتم الاتصال بالجهاز، حاول مرة أخرى",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في الاتصال",
        description: "حدث خطأ أثناء الاتصال بالجهاز",
        variant: "destructive",
      });
    }
  };

  const disconnectDevice = async () => {
    try {
      await BluetoothService.disconnect();
      setConnectedDevice(null);
      onDisconnected();
      
      toast({
        title: "تم قطع الاتصال",
        description: "تم قطع الاتصال بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في قطع الاتصال",
        description: "حدث خطأ أثناء قطع الاتصال",
        variant: "destructive",
      });
    }
  };

  if (connectedDevice) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-right text-green-700 flex items-center gap-2">
            <Bluetooth className="w-5 h-5" />
            متصل بجهاز الاشتياق
            {!isNative && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">تجريبي</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800">{connectedDevice.name}</h3>
                <p className="text-sm text-green-600">متصل ونشط</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <Button
            onClick={disconnectDevice}
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
          >
            <WifiOff className="w-4 h-4 mr-2" />
            قطع الاتصال
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-lavender/30">
      <CardHeader>
        <CardTitle className="text-right text-dark-plum flex items-center gap-2">
          <Bluetooth className="w-5 h-5" />
          البحث عن أجهزة الاشتياق
          {!isNative && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">وضع تجريبي</span>}
        </CardTitle>
        <CardDescription className="text-right">
          {isNative ? "ابحث عن أجهزة الاشتياق القريبة واتصل بها" : "التطبيق يعمل في المتصفح - ستظهر أجهزة تجريبية"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isNative && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">وضع تجريبي</p>
                <p>لاستخدام البلوتوث الحقيقي، يجب بناء التطبيق كـ APK وتشغيله على الهاتف</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={startScanning}
          disabled={isScanning}
          className="w-full bg-gradient-to-r from-lavender to-baby-pink hover:from-lavender-dark hover:to-baby-pink-dark text-white"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري البحث...
            </>
          ) : (
            <>
              <Bluetooth className="w-4 h-4 mr-2" />
              بحث عن الأجهزة
            </>
          )}
        </Button>

        {devices.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-dark-plum">الأجهزة المتاحة:</h3>
            {devices.map((device) => (
              <div
                key={device.device.deviceId}
                className="bg-lavender/10 border border-lavender/20 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-lavender" />
                    <div>
                      <p className="font-medium text-dark-plum">{device.name}</p>
                      {device.rssi && (
                        <p className="text-xs text-dark-plum/60">
                          قوة الإشارة: {device.rssi} dBm
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => connectToDevice(device)}
                    size="sm"
                    className="bg-lavender hover:bg-lavender-dark text-white"
                  >
                    اتصال
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isInitialized && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700 text-center">
              يرجى تفعيل البلوتوث ومنح الصلاحيات المطلوبة
            </p>
          </div>
        )}

        {!isScanning && devices.length > 0 && (
          <Button
            onClick={startScanning}
            className="w-full mt-4 bg-gradient-to-r from-lavender to-baby-pink hover:from-lavender-dark hover:to-baby-pink-dark text-white"
          >
            بحث مرة أخرى
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BluetoothDeviceSelector;
