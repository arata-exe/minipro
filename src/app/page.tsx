"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

type SensorData = {
  smoke: number;
  ldr: number;
  vibration: number;
};

const Dashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    smoke: 0,
    ldr: 0,
    vibration: 0,
  });

  const [ledStatus, setLedStatus] = useState<number>(0); // LED status

  // Fetch sensor data from the API
  const getSensorData = async () => {
    try {
      const response = await axios.get('/api/get'); // Fetch data from your API
      const data = response.data;
      setSensorData({
        smoke: data.tbl_smoke || 0,
        ldr: data.tbl_ldr || 0,
        vibration: data.tbl_vibration || 0,
      });
      console.log(data)
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
    }
  };

  // Fetch LED status
  const getLedStatus = async () => {
    try {
      const response = await axios.get('/api'); // Adjust endpoint if necessary
      const data = response.data;
      setLedStatus(data.tbl_led === null ? 0 : data.tbl_led); // Set LED status
    } catch (error) {
      console.error('Failed to fetch LED status:', error);
    }
  };

  // Update LED status
  const updateLEDStatus = async (newState: number) => {
    try {
      await axios.put('/api', { tbl_led: newState });
      getLedStatus(); // Refresh LED status after updating
    } catch (error) {
      console.error("Failed to update LED status:", error);
    }
  };

  useEffect(() => {
    getSensorData();
    getLedStatus(); // Fetch LED status on component mount
    const intervalId = setInterval(() => {
      getSensorData();
      getLedStatus();
    }, 5000); // 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Sensor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Smoke Level" value={sensorData.smoke} unit="ppm" />
        <Card title="Light Level (LDR)" value={sensorData.ldr} unit="lux" />
        <Card title="Vibration" value={sensorData.vibration} unit="Hz" />
        <Card title="LED Status" value={ledStatus === 1 ? "On" : "Off"} unit="Current state" />
      </div>
      
      <div className="mt-6 flex space-x-4">
        <button 
          onClick={() => updateLEDStatus(1)}
          className="px-4 py-2 rounded-lg text-white bg-green-500"
        >
          Turn On LED
        </button>
        <button 
          onClick={() => updateLEDStatus(0)}
          className="px-4 py-2 rounded-lg text-white bg-red-500"
        >
          Turn Off LED
        </button>
      </div>
    </div>
  );
};

// Card component to display sensor data
const Card = ({ title, value, unit }: { title: string; value: any; unit: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    </div>
    <div className="text-3xl font-bold text-gray-700">{value}</div>
    <p className="text-xs text-gray-500">{unit}</p>
  </div>
);

export default Dashboard;
