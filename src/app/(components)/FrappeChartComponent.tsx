import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, LineElement, PointElement, Legend, Tooltip, Title } from "chart.js";
import "chartjs-adapter-date-fns";
import { de } from "date-fns/locale";

ChartJS.register(CategoryScale, LinearScale, TimeScale, LineElement, PointElement, Legend, Tooltip, Title);

interface FrappeChartComponentProps {
  apiDeviceParam: string;
}

const FrappeChartComponent: React.FC<FrappeChartComponentProps> = ({ apiDeviceParam }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [device1, setDevice1] = useState<any>();
  const [waterlevelLabels, setWaterlevelLabels] = useState<any>([]);
  const [timestampLabels, setTimestampLabels] = useState<string[]>([]);

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
      setWaterlevelLabels(device1.waterlevels.map((entry: any) => entry.waterlevel) || []);
      const labels = device1.waterlevels.slice(-28).map((entry: any) => entry.timestamp);

      setTimestampLabels(labels);
    }
  }, [device1]);

  const lineChartData = {
    labels: timestampLabels,
    datasets: [
      {
        label: "Wasserstand",
        data: waterlevelLabels,
        borderColor: "rgb(75, 192, 192)",
        pointRadius: 4,
        pointHitRadius: 10,
        cubicInterpolationMode: "monotone",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Wasserstand",
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
        },
      },
      y: {
        ticks: {
          stepSize: 1,
          callback: function (value: number, index: number, values: number[]) {
            switch (value) {
              case 0:
                return "Leer";
              case 1:
                return "Medium";
              case 2:
                return "Voll";
              default:
                return "";
            }
          },
        },
      },
    },
  };

  return (
    <div>
      <Line ref={chartRef} options={options} data={lineChartData} />{" "}
    </div>
  );
};

export default FrappeChartComponent;
