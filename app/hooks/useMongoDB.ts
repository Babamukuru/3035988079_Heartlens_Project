// hooks/useMongoDB.ts
import { useState, useCallback  } from 'react';

interface HistoricalData {
  avgHeartRate: number;
  avgHRV: number;
}

// types.ts (or at the top of your file)
export type RecordData = {
    heartRate: {
      bpm: number;
      confidence: number;
    };
    hrv: {
      sdnn: number;
      confidence: number;
    };
    ppgData: number[];
    timestamp?: Date | string; // Can be Date object or ISO string
  };

export default function useMongoDB() {
  const [isUploading, setIsUploading] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    avgHeartRate: 0,
    avgHRV: 0,
  });

  // POST: Save data to MongoDB
  const pushDataToMongo = useCallback( async (recordData: RecordData) => {
    if (isUploading) return; // Prevent overlapping calls
    setIsUploading(true);
    try {
      const response = await fetch('/api/save-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });
      const result = await response.json();
      if (result.success) {
        console.log('✅ Data saved:', result.data);
      } else {
        console.error('❌ Error:', result.error);
      }
    } catch (error) {
      console.error('🚨 Network error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [isUploading]);

  // GET: Fetch historical averages
  const fetchHistoricalData = useCallback(async () => {
    try {
      const response = await fetch('/api/handle-record', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.success) {
        setHistoricalData({
          avgHeartRate: result.avgHeartRate,
          avgHRV: result.avgHRV,
        });
      } else {
        console.error('❌ Error:', result.error);
      }
    } catch (error) {
      console.error('🚨 Network error:', error);
    }
  }, []);

  return {
    isUploading,
    pushDataToMongo,
    fetchHistoricalData,
    historicalData,
  };
}
