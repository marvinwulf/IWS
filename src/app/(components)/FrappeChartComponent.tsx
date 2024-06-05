import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import Annotation from "chartjs-plugin-annotation";
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, LineElement, PointElement, Legend, Tooltip, Title } from "chart.js";
import "chartjs-adapter-date-fns";
import { de } from "date-fns/locale";
import { subDays } from "date-fns";
import tailwindConfig from "../../../tailwind.config";

ChartJS.register(CategoryScale, LinearScale, TimeScale, LineElement, PointElement, Legend, Tooltip, Title, Annotation);

interface FrappeChartComponentProps {
  apiDeviceParam: string;
}

const FrappeChartComponent: React.FC<FrappeChartComponentProps> = ({ apiDeviceParam }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [device1, setDevice1] = useState<any>();
  const [waterlevelData, setWaterlevelData] = useState<number[]>([]);
  const [measurementData, setMeasurementData] = useState<number[]>([]);
  const [timestampLabels, setTimestampLabels] = useState<string[]>([]);
  const [pumpActivationDates, setPumpActivationDates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/fetchdb?action=fetchHistorical&devicename=${apiDeviceParam}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setDevice1(data.historicalData);
      } catch (error) {
        console.error("API call failed", error);
      }
    };

    fetchData();
  }, [apiDeviceParam]);

  useEffect(() => {
    if (device1) {
      const last14Days = Array.from({ length: 28 }, (_, i) => subDays(new Date(), i).toISOString().split("T")[0]).reverse();

      const waterlevelMap = new Map();
      const measurementMap = new Map();
      const pumpActivationDatesSet = new Set();

      device1.waterlevels.forEach((entry: any) => {
        const date = entry.timestamp.split(" ")[0];
        waterlevelMap.set(date, entry.waterlevel);
      });

      device1.measurements.forEach((entry: any) => {
        const date = entry.timestamp.split(" ")[0];
        measurementMap.set(date, entry.measurementData);
      });

      device1.pump_activations.forEach((entry: any) => {
        const date = entry.timestamp.split(" ")[0];
        pumpActivationDatesSet.add(date);
      });

      const waterlevelData = last14Days.map((date) => (waterlevelMap.has(date) ? waterlevelMap.get(date) : null));
      const measurementData = last14Days.map((date) => (measurementMap.has(date) ? measurementMap.get(date) : null));
      const pumpActivationDates = Array.from(pumpActivationDatesSet);

      setTimestampLabels(last14Days);
      setWaterlevelData(waterlevelData);
      setMeasurementData(measurementData);
      setPumpActivationDates(pumpActivationDates);
    }
  }, [device1]);

  const skipped = (ctx: any, value: any) => (ctx.p0.skip || ctx.p1.skip ? value : undefined);

  const lineChartData = {
    labels: timestampLabels,
    datasets: [
      {
        label: "Bodenfeuchte",
        data: measurementData,
        borderColor: tailwindConfig.theme.colors["ms-orange"],
        backgroundColor: tailwindConfig.theme.colors["ms-hbg"],
        pointRadius: 4,
        pointHitRadius: 10,
        cubicInterpolationMode: "monotone",
        spanGaps: true,
        yAxisID: "y-axis-1",
        segment: {
          borderColor: (ctx: any) => skipped(ctx, "rgb(0,0,0,0.2)"),
          borderDash: (ctx: any) => skipped(ctx, [6, 6]),
        },
      },
      {
        label: "Wasserstand",
        data: waterlevelData,
        borderColor: tailwindConfig.theme.colors["ms-colored"],
        backgroundColor: tailwindConfig.theme.colors["ms-hbg"],
        pointRadius: 4,
        pointHitRadius: 10,
        cubicInterpolationMode: "monotone",
        spanGaps: true,
        yAxisID: "y-axis-2",
        segment: {
          borderColor: (ctx: any) => skipped(ctx, "rgb(0,0,0,0.2)"),
          borderDash: (ctx: any) => skipped(ctx, [6, 6]),
        },
      },
    ],
  };

  const pumpannotation = pumpActivationDates.map((date) => ({
    type: "line",
    mode: "vertical",
    scaleID: "x",
    value: date,
    borderColor: tailwindConfig.theme.colors["ms-fg"],
    borderWidth: 1,
  }));

  const options = {
    responsive: true,
    animations: false,
    plugins: {
      legend: {
        position: "chartArea",
        align: "end",
        labels: {
          font: {
            family: "sans-serif",
            size: 11,
            weight: "lighter",
            lineHeight: 1.2,
          },
          boxHeight: 10,
          boxWidth: 40,
          padding: 8,
        },
      },
      annotation: {
        annotations: pumpannotation,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "dd.MM",
          },
        },
        adapters: {
          date: {
            locale: de,
          },
        },
        ticks: {
          stepSize: 1,
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      "y-axis-1": {
        type: "linear",
        position: "left",
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
        title: {
          display: true,
          text: "Bodenfeuchte %",
        },
      },
      "y-axis-2": {
        type: "linear",
        position: "right",
        min: -0.5,
        max: 2.5,
        ticks: {
          stepSize: 0.5,
          callback: function (value: number) {
            switch (value) {
              case 0:
                return "Leer";
              case 1:
                return "  /";
              case 2:
                return "Voll";
              default:
                return "";
            }
          },
        },
        title: {
          display: true,
          text: "Füllstand Wassertank",
        },
        grid: {
          drawOnChartArea: false, // to prevent grid lines from overlapping
        },
      },
    },
  };

  return (
    <div className="p-4 pt-6">
      <Line ref={chartRef} options={options} data={lineChartData} />
    </div>
  );
};

export default FrappeChartComponent;
