import React from 'react';
import BluetoothDeviceSelector from '@/components/BluetoothDeviceSelector'; // عدل المسار حسب مشروعك

const BluetoothPage = () => {
  const handleDeviceConnected = (device) => {
    console.log('تم الاتصال بالجهاز:', device);
  };

  const handleDeviceDisconnected = () => {
    console.log('تم قطع الاتصال بالجهاز');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center justify-center font-arabic">
      <h1 className="text-2xl font-bold mb-6">أجهزة البلوتوث القريبة</h1>
      <BluetoothDeviceSelector
        onDeviceConnected={handleDeviceConnected}
        onDisconnected={handleDeviceDisconnected}
      />
    </div>
  );
};

export default BluetoothPage;
