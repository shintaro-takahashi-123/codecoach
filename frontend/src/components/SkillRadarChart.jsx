import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SkillRadarChart = ({ skills }) => {
  const labels = Object.keys(skills);
  const current = labels.map((key) => skills[key].current);
  const required = labels.map((key) => skills[key].required);

  const data = {
    labels,
    datasets: [
      {
        label: "現在のスキル",
        data: current,
        backgroundColor: "rgba(0, 200, 83, 0.2)",
        borderColor: "rgba(0, 200, 83, 1)",
        borderWidth: 2,
      },
      {
        label: "必要なスキル",
        data: required,
        backgroundColor: "rgba(0, 184, 212, 0.2)",
        borderColor: "rgba(0, 184, 212, 1)",
        borderWidth: 2,
      },
    ],
  };

  return <Radar data={data} />;
};

export default SkillRadarChart;
