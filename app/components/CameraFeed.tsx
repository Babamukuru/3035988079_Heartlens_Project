"use client";
import React from "react";
import {useCallback, useState} from "react";

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ videoRef, canvasRef }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480  }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      
      setStream(newStream);
      setHasPermission(true);
    } catch (err) {
      console.error("Camera error:", err);
      setHasPermission(false);
    }
  }, [videoRef]); 

  // 2. Stop Camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setHasPermission(false);
    }
  },[stream]);

  return (
    <div>
      {/* Video Element */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="w-full max-w-[640px] h-auto border border-black"
      />
     <div className="mt-4">
        <button 
          onClick={startCamera} 
          disabled={hasPermission}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-purple-600 w-full"
        >
          Start Camera
        </button>
        <button 
          onClick={stopCamera} 
          disabled={!hasPermission}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-purple-600 w-full"
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
};

export default CameraFeed;
