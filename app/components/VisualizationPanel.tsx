"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

// Register the required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface VisualizationPanelProps {
  ppgData: number[];
}

export default function VisualizationPanel({ ppgData }: VisualizationPanelProps) {
  // Chart.js configuration
  const chartData = {
    labels: Array.from({ length: ppgData.length }, (_, i) => i.toString()),
    datasets: [
      {
        label: "PPG Signal",
        data: ppgData,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    animation: {
      duration: 0, // Disable animation for better performance
    },
  };

  return (
    <div className="w-full h-64">
      <h3>Real-Time Visualization</h3>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}