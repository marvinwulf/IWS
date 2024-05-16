"use client";

import { Typography, Tooltip } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    if (batteryPercentage <= 10 && batteryPercentage > 5 && roundedPercentage) {
      return `mdi mdi-battery-${roundedPercentage} text-ms-orange`;
    } else if (batteryPercentage <= 5 && roundedPercentage) {
      return `mdi mdi-battery-${roundedPercentage} text-ms-red blinkanim`;
    } else if (roundedPercentage) {
      return `mdi mdi-battery-${roundedPercentage}`;
    } else {
      return `mdi mdi-battery-alert text-ms-orange`;
    }
  };

  const getWlIndicatorColors = (currentwl: number, indicatorBar: number) => {
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
    <>
      {devices.filter((device: any) => (device.currentwl === 0 && device.status === 1) || (device.battery <= 5 && device.battery != null)).length >
        0 && (
        <>
          <span className="relative top-[26px] left-[45px] bg-ms-bg px-2 text-ms-orange text-sm">Geräte, die Aufmerksamkeit benötigen</span>
          <div className="flex px-4 mx-6 pt-8 mt-4 gap-6 flex-wrap border-t border-ms-orange">
            {devices
              .filter((device: any) => (device.currentwl === 0 && device.status === 1) || (device.battery <= 5 && device.battery != null))
              .map((device: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col w-52 border rounded-md overflow-hidden cursor-pointer shadow-lg shadow-gray-200 hover:shadow-gray-300 hover:scale-105 tr"
                >
                  <div className={`bg-ms-hbg border-b border-ms-accent ${device.status === 1 ? "border-ms-accent" : "border-ms-red"}`}>
                    <div className="flex items-center px-4 py-3 gap-3 -mb-0.5">
                      <div className={`aspect-square h-[8px] rounded-lg ${device.status === 1 ? "bg-ms-green" : "bg-ms-red"}`}></div>
                      <p className="text-ms-fg font-light text-lg">{device.devicefriendlyname}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-grow bg-ms-bg my-4 ml-4 pr-2 gap-0.5">
                      <div className={`h-2 w-[33%] rounded-l-md ${getWlIndicatorColors(device.currentwl, 0)}`}></div>
                      <div className={`h-2 w-[33%]  ${getWlIndicatorColors(device.currentwl, 1)}`}></div>
                      <div className={`h-2 w-[33%] rounded-r-md ${getWlIndicatorColors(device.currentwl, 2)}`}></div>
                    </div>
                    <Tooltip
                      content={device.battery !== null ? device.battery + "%" : "Batteriefehler"}
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                      className="bg-ms-hbg text-ms-fg border border-ms-accents mt-1"
                    >
                      <div className="flex justify-center items-center aspect-square w-[30.45px] mr-2 rounded-2xl hover:bg-ms-accent tr">
                        <i className={`text-center text-lg text-ms-fg  ${getBatteryIconClass(device.battery)}`}></i>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {devices.filter((device: any) => device.currentwl != 0 && device.status === 1 && (device.battery > 5 || device.battery === null)).length >
        0 && (
        <>
          <span className="relative top-[26px] left-[45px] bg-ms-bg px-2 text-ms-accent-2 text-sm">Geräte: Online</span>
          <div className="flex px-4 mx-6 pt-8 mt-4 gap-6 flex-wrap border-t border-ms-accent-1">
            {devices
              .filter((device: any) => device.currentwl != 0 && device.status === 1 && (device.battery > 5 || device.battery === null))
              .map((device: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col w-52 border rounded-md overflow-hidden cursor-pointer shadow-lg shadow-gray-200 hover:shadow-gray-300 hover:scale-105 tr"
                >
                  <div className={`bg-ms-hbg border-b border-ms-accent ${device.status === 1 ? "border-ms-accent" : "border-ms-red"}`}>
                    <div className="flex items-center px-4 py-3 gap-3 -mb-0.5">
                      <div className={`aspect-square h-[8px] rounded-lg ${device.status === 1 ? "bg-ms-green" : "bg-ms-red"}`}></div>
                      <p className="text-ms-fg font-light text-lg">{device.devicefriendlyname}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-grow bg-ms-bg my-4 ml-4 pr-2 gap-0.5">
                      <div className={`h-2 w-[33%] rounded-l-md ${getWlIndicatorColors(device.currentwl, 0)}`}></div>
                      <div className={`h-2 w-[33%]  ${getWlIndicatorColors(device.currentwl, 1)}`}></div>
                      <div className={`h-2 w-[33%] rounded-r-md ${getWlIndicatorColors(device.currentwl, 2)}`}></div>
                    </div>
                    <Tooltip
                      content={device.battery != null ? device.battery + "%" : "Batteriefehler"}
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                      className="bg-ms-hbg text-ms-fg border border-ms-accents mt-1"
                    >
                      <div className="flex justify-center items-center aspect-square w-[30.45px] mr-2 rounded-2xl hover:bg-ms-accent tr">
                        <i className={`text-center text-lg text-ms-fg  ${getBatteryIconClass(device.battery)}`}></i>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {devices.filter((device: any) => device.status === 0).length > 0 && (
        <>
          <span className="relative top-[26px] left-[45px] bg-ms-bg px-2 text-ms-accent-2 text-sm">Geräte: Offline</span>
          <div className="flex px-4 mx-6 pt-8 mt-4 mb-8 gap-6 flex-wrap border-t border-ms-accent-1">
            {devices
              .filter((device: any) => device.status === 0)
              .map((device: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col w-52 border rounded-md overflow-hidden cursor-pointer shadow-lg shadow-gray-200 hover:shadow-gray-300 hover:scale-105 tr"
                >
                  <div className="bg-ms-hbg border-b border-ms-accent">
                    <div className="flex items-center px-4 py-3 gap-3 -mb-0.5">
                      <div className={`aspect-square h-[8px] rounded-lg ${device.status === 1 ? "bg-ms-green" : "bg-ms-red"}`}></div>
                      <p className="text-ms-fg font-light text-lg">{device.devicefriendlyname}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-grow bg-ms-bg my-4 ml-4 pr-2 gap-0.5">
                      <div className={`h-2 w-[33%] rounded-l-md ${getWlIndicatorColors(device.currentwl, 0)}`}></div>
                      <div className={`h-2 w-[33%]  ${getWlIndicatorColors(device.currentwl, 1)}`}></div>
                      <div className={`h-2 w-[33%] rounded-r-md ${getWlIndicatorColors(device.currentwl, 2)}`}></div>
                    </div>
                    <Tooltip
                      content={device.battery !== null ? device.battery + "%" : "Batteriefehler"}
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                      className="bg-ms-hbg text-ms-fg border border-ms-accents mt-1"
                    >
                      <div className="flex justify-center items-center aspect-square w-[30.45px] mr-2 rounded-2xl hover:bg-ms-accent tr">
                        <i className={`text-center text-lg text-ms-fg  ${getBatteryIconClass(device.battery)}`}></i>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {devices.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full pb-16">
          <div className="flex flex-col items-center justify-end w-[200px] h-[160px] overflow-hidden">
            <Image className="-mb-8" alt="No Content Cat Mascot" src="/cat-mascot-void.svg" width={200} height={200} />
            <p className="text-ms-accent-3 text-center text-lg">Noch keine IWS Geräte</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
