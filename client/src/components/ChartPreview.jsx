import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function ChartPreview() {
  const data = {
    labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    datasets: [
      {
        label: "步数",
        data: [6000, 7500, 8000, 7200, 9000, 10000, 8500],
        borderColor: "#4f66d6",
        backgroundColor: "rgba(79,102,214,0.1)",
        tension: 0.4
      }
    ]
  };

  return <Line data={data} />;
}