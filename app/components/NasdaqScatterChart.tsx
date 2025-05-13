"use client";
import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
Chart.register(LinearScale, PointElement, Tooltip, Legend);

export default function NasdaqScatterChart() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/nasdaq100")
      .then(res => res.json())
      .then(res => setData(res.data));
  }, []);

  if (!data) return <div>차트 데이터를 불러오는 중...</div>;

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "40px auto" }}>
      <h3>나스닥 100 평균-분산 산점도</h3>
      <Scatter
        data={{
          datasets: [{
            label: "NASDAQ 100",
            data: data.map((d: any) => ({ x: d.mean, y: d.variance, label: d.symbol })),
            backgroundColor: "rgba(54, 162, 235, 0.7)",
          }]
        }}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx: any) => `${ctx.raw.label}: 평균 ${ctx.raw.x.toFixed(2)}, 분산 ${ctx.raw.y.toFixed(2)}`
              }
            }
          },
          scales: {
            x: { title: { display: true, text: "평균값" } },
            y: { title: { display: true, text: "분산" } }
          }
        }}
      />
    </div>
  );
}