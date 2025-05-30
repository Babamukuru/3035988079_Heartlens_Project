'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import CameraFeed from './components/CameraFeed';
import MetricsCard from './components/MetricsCard';
import SignalCombinationSelector from './components/SignalCombinationSelector';
//import SignalConfig from "./components/SignalConfig";
//import HeartRateMonitor from "./components/HeartRateMonitor";
import ChartComponent from './components/ChartComponent';
import usePPGProcessing from './hooks/usePPGProcessing';
import useSignalQuality from './hooks/useSignalQuality';
import useMongoDB, { RecordData } from './hooks/useMongoDB';

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSampling, setIsSampling] = useState(false); // New state for sampling
  const [signalCombination, setSignalCombination] = useState('default');
  const [showConfig, setShowConfig] = useState(false);
  const { pushDataToMongo } = useMongoDB();
  
  // Define refs for video and canvas
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  

  const {
    ppgData,
    valleys,
    heartRate,
    hrv,
    startCamera,
    stopCamera,
  } = usePPGProcessing(isRecording, signalCombination, videoRef, canvasRef);

  const { signalQuality, qualityConfidence } = useSignalQuality(ppgData);


  // Start or stop recording
  useEffect(() => {
    if (isRecording) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      // Cleanup when component unmounts
      stopCamera();
    };
  }, [isRecording, startCamera, stopCamera]);

  useEffect(() => {
    let animationFrame: number;
 
    const processFrameLoop = () => {
      if (isRecording) {
         // Process the current frame
        animationFrame = requestAnimationFrame(processFrameLoop); // Schedule next frame
      }
    };

    if (isRecording) {
      processFrameLoop();
    }
    return () => {
      cancelAnimationFrame(animationFrame); // Clean up animation frame on unmount
    };
  }, [isRecording]);

  // Automatically send data every 10 seconds
  // Automatically send data every second when sampling is enabled
  const recordData = useMemo((): RecordData => ({
    heartRate: {
      bpm: isNaN(heartRate.bpm) ? 0 : heartRate.bpm, // Replace NaN with "ERRATIC"
      confidence: heartRate.confidence || 0,
    },
    hrv: {
      sdnn: isNaN(hrv.sdnn) ? 0 : hrv.sdnn, // Replace NaN with "ERRATIC"
      confidence: hrv.confidence || 0,
    },

    ppgData: ppgData, // Use the provided ppgData array
    timestamp: new Date(),
  }), [heartRate, hrv, ppgData]);


  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isSampling && ppgData.length > 0) {
      intervalId = setInterval(() => {


        pushDataToMongo(recordData);
      }, 10000); // Send data every second
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSampling, ppgData, pushDataToMongo, recordData]);

  

  return (
    <div className="flex flex-col items-center p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mb-4">
        {/* Title */}
        <h1 className="text-3xl font-bold">HeartLen</h1>
        {/* Recording Button */}
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`p-3 rounded-lg text-sm transition-all duration-300 ${
            isRecording
              ? 'bg-red-500 hover:bg-orange-600 text-white'
              : 'bg-cyan-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRecording ? '⏹ STOP' : '⏺ START'} RECORDING
        </button>
        {/* Sampling Button */}
        <button
          onClick={() => setIsSampling(!isSampling)}
          className={`p-3 rounded-lg text-sm transition-all duration-300 ml-2 ${
            isSampling
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
          disabled={!isRecording} // Enable only when recording is active
        >
          {isSampling ? '⏹ STOP SAMPLING' : '⏺ START SAMPLING'}
        </button>
      </div>

      {/* Main Grid: Camera and Chart Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Left Column: Camera Feed */}
        <div className="space-y-4">
          {/* Camera Feed */}
          <CameraFeed videoRef={videoRef} canvasRef={canvasRef} />
          {/* Signal Combination Selector */}
          <button
            onClick={() => setShowConfig((prev) => !prev)}
            className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 w-full"
          >
            Toggle Config
          </button>
          {showConfig && (
            <SignalCombinationSelector
              signalCombination={signalCombination}
              setSignalCombination={setSignalCombination}
            />
          )}
        </div>

        {/* Right Column: Chart and Metrics */}
        <div className="space-y-4">
          {/* Chart */}
          <ChartComponent ppgData={ppgData} valleys={valleys} />

          {/* Save Data to MongoDB Button */}
          <button
            onClick={() => {
              void pushDataToMongo(recordData); // Explicit void
  }}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-purple-600"
          >
            Save Data to MongoDB
          </button>

          {/* Metrics Cards (Side by Side) */}
          <div className="flex flex-wrap gap-4">
            {/* Heart Rate Card */}
            <MetricsCard
              title="HEART RATE"
              value={heartRate || {}} // Pass the HeartRateResult object
              confidence={heartRate?.confidence || 0}
            />

            {/* HRV Card */}
            <MetricsCard
              title="HRV"
              value={hrv || {}} // Pass the HRVResult object
              confidence={hrv?.confidence || 0}
            />

            {/* Signal Quality Card (Fallback for now) */}
            <MetricsCard
              title="SIGNAL QUALITY"
              value={{
                value: signalQuality?.toString() || '--',
                unit: '',
                confidence: qualityConfidence || 0
                }}
              confidence={qualityConfidence || 0}
              />
          </div>
        </div>
      </div>
    </div>
  );
}
;
