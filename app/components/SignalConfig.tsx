"use client";
import { useState } from "react";
interface SignalConfigProps {
    signalMode: string;
    setSignalMode: (mode: string) => void;
  }
export default function SignalConfig({ signalMode, setSignalMode }: SignalConfigProps) {
    console.log("Props received in SignalConfig:", { signalMode, setSignalMode });
  // State to toggle visibility of the radio buttons
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div>
      {/* Header */}
      <h3>Signal Configuration</h3>

      {/* Display Current Mode */}
      <p>Selected Mode: {signalMode}</p>

      {/* Toggle Button */}
      <button
        onClick={() => setIsConfigOpen(!isConfigOpen)} // Toggle visibility of radio buttons
      >
        {isConfigOpen ? "Hide Options" : "Configure Signal"}
      </button>

      {/* Radio Buttons (Conditionally Rendered) */}
      {isConfigOpen && (
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="signal-mode"
              value="Green Only"
              checked={signalMode === "Green Only"}
              onChange={(e) => setSignalMode(e.target.value)}
              className="mr-2"
            />
            Green Only
          </label>
          <br />
          <label className="flex items-center">
            <input
              type="radio"
              name="signal-mode"
              value="Red Only"
              checked={signalMode === "Red Only"}
              onChange={(e) => setSignalMode(e.target.value)}
              className="mr-2"
            />
            Red Only
          </label>
          <br />
          <label className="flex items-center">
            <input
              type="radio"
              name="signal-mode"
              value="Blue Only"
              checked={signalMode === "Blue Only"}
              onChange={(e) => setSignalMode(e.target.value)}
              className="mr-2"
            />
            Blue Only
          </label>
          <br />
          <label className="flex items-center">
            <input
              type="radio"
              name="signal-mode"
              value="2R - G - B"
              checked={signalMode === "2R - G - B"}
              onChange={(e) =>setSignalMode(e.target.value)}
              className="mr-2"
            />
            2R - G - B
          </label>
          <br />
          <label className="flex items-center">
            <input
              type="radio"
              name="signal-mode"
              value="Custom"
              checked={signalMode === "Custom"}
              onChange={(e) => setSignalMode(e.target.value)}
              className="mr-2"
            />
            Custom
          </label>
        </div>
      )}
    </div>
  );
}
