import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface ChartProps {
  data?: Chart.ChartData;
  type: Chart.ChartType;
  options?: Chart.ChartOptions;
}

const Charts: React.FC<ChartProps> = ({ data, type, options }: any) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const myChart = new Chart(ctx, {
          type,
          data,
          options,
        });

        return () => {
          myChart.destroy()
        };
      }
    }
  }, [data, type, options]);

  return (
    <canvas
      ref={(ref) => (chartRef.current ? null : (chartRef.current = ref))}
    />
  );
};

export default Charts;
