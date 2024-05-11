"use client";

import { Typography, Tooltip } from "@material-tailwind/react";
import { useEffect, useState } from "react";

export default function Page() {
  const [devices, setDevices] = useState<any>([]);
  const [waterlevels, setWaterlevels] = useState<any>([]);

  useEffect(() => {
    const fetchDiskInfo = async () => {
      try {
        const res = await fetch("/api/fetchdb");
        if (!res.ok) {
          throw new Error("Failed to fetch Database");
        }
        const data = await res.json();

        setDevices(data.devices);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDiskInfo();
  }, []);

  const getBatteryIconClass = (batteryPercentage: number) => {
    const roundedPercentage = Math.round(batteryPercentage / 10) * 10;
    if (roundedPercentage) {
      return `mdi mdi-battery-${roundedPercentage} px-3 text-lg text-ms-fg`;
    } else {
      return `mdi mdi-battery-alert px-3 text-lg text-ms-fg`;
    }
  };

  const getWlIndicatoColors = (currentwl: number, indicatorBar: number) => {
    switch (indicatorBar) {
      case 0:
        switch (currentwl) {
          case 0:
            return "bg-ms-red";
          case 1:
            return "bg-ms-orange";
          case 2:
            return "bg-ms-green";
        }
      case 1:
        switch (currentwl) {
          case 0:
            return "bg-ms-accent";
          case 1:
            return "bg-ms-orange";
          case 2:
            return "bg-ms-green";
        }
      case 2:
        switch (currentwl) {
          case 0:
            return "bg-ms-accent";
          case 1:
            return "bg-ms-accent";
          case 2:
            return "bg-ms-green";
        }
    }
  };

  return (
    <div className="device-grid-container p-10 gap-10">
      {devices.map((device: any, index: number) => (
        <div
          key={index}
          className="flex flex-col w-56 border rounded-md overflow-hidden cursor-pointer shadow-lg shadow-gray-200 hover:shadow-gray-300 hover:scale-105 tr"
        >
          <div className="bg-ms-hbg border-b border-ms-accent">
            <div className="flex items-center px-4 py-3 gap-3 -mb-0.5">
              <div className={`aspect-square h-[8px] rounded-lg ${device.status === 1 ? "bg-ms-green" : "bg-ms-red"}`}></div>
              <p className="text-ms-fg font-light text-lg">{device.devicefriendlyname}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-grow bg-ms-bg py-4 pl-4 pr-3 gap-0.5">
              <div className={`h-2 w-[33%] rounded-l-md ${getWlIndicatoColors(device.currentwl, 0)}`}></div>
              <div className={`h-2 w-[33%]  ${getWlIndicatoColors(device.currentwl, 1)}`}></div>
              <div className={`h-2 w-[33%] rounded-r-md ${getWlIndicatoColors(device.currentwl, 2)}`}></div>
            </div>
            <Tooltip
              content={device.battery + "%"}
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}
              className="bg-ms-hbg text-ms-fg border border-ms-accents mt-1"
            >
              <i className={getBatteryIconClass(device.battery)}></i>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}
