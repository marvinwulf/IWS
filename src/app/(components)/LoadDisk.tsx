import React, { useState, useEffect } from "react";
import { Progress, Typography, Menu, MenuHandler, MenuList } from "@material-tailwind/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function LoadDisk() {
  const [diskLoad, setDiskLoad] = useState<any>("- ");
  const [diskInfo, setDiskInfo] = useState<any>("-");
  const [totalDiskInfo, setTotalDiskInfo] = useState<any>("-");

  const [mainDrive, setMainDrive] = useState<any>(0);

  const [openMenu, setOpenMenu] = React.useState(false);

  useEffect(() => {
    fetchDiskInfo();
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchDiskInfo();
      }
    }, 16000);

    return () => clearInterval(interval);
  }, []);

  const fetchDiskInfo = async () => {
    try {
      const res = await fetch("/api/system");
      if (!res.ok) {
        throw new Error("Failed to fetch Disk load");
      }
      const data = await res.json();

      let totalDiskUse = 0;
      let totalDiskSpace = 0;
      for (let index = 0; index < data.data.disks.length; index++) {
        totalDiskUse += data.data.disks[index].used;
        totalDiskSpace += data.data.disks[index].size;
      }

      setDiskLoad(Math.ceil((totalDiskUse / totalDiskSpace) * 100));
      setDiskInfo(data.data.disks);

      let totalData = { used: totalDiskUse, size: totalDiskSpace, available: totalDiskSpace - totalDiskUse };
      setTotalDiskInfo(totalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function convertSize(sizeInB: number) {
    if (sizeInB >= 1024 * 1024 * 1024 * 1024) {
      return (sizeInB / (1024 * 1024 * 1024 * 1024)).toFixed(1).replace(/\.0$/, "") + " TB";
    } else if (sizeInB >= 1024 * 1024 * 1024) {
      return (sizeInB / (1024 * 1024 * 1024)).toFixed(1).replace(/\.0$/, "") + " GB";
    } else if (sizeInB >= 1024 * 1024) {
      return (sizeInB / (1024 * 1024)).toFixed(1).replace(/\.0$/, "") + " MB";
    } else if (sizeInB >= 1024) {
      return (sizeInB / 1024).toFixed(1).replace(/\.0$/, "") + " KB";
    } else if (typeof sizeInB === "number") {
      return sizeInB + "B";
    } else {
      return "-";
    }
  }

  function ksep(number: number) {
    let numStr = String(number);

    let parts = numStr.split(".");
    let integerPart = parts[0];
    let fractionalPart = parts[1] ? "." + parts[1] : "";

    let integerWithSeparators = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return integerWithSeparators + fractionalPart;
  }

  const gradientColor = (load: number) => {
    load = Math.ceil(load * 10) / 10;
    const colorsData = require("/public/indicator-colormap-higher-margin.json");
    return colorsData[load] ? `rgb(${colorsData[load].join(", ")})` : "white";
  };

  return (
    <div className="flex w-[270px] justify-end">
      <Menu
        open={openMenu}
        handler={setOpenMenu}
        allowHover
        dismiss={{
          itemPress: false,
        }}
      >
        <MenuHandler>
          <div className="flex items-center">
            <p className="text-sm text-right -mr-0.5">{diskLoad}%</p>
            <div className="mdi mdi-harddisk px-2"></div>
            <div className="flex-start flex h-1.5 w-48 overflow-hidden rounded-full bg-ms-grayscale font-sans text-xs font-medium">
              <div
                className="flex h-full items-center justify-center overflow-hidden break-all rounded-full bg-ms-accent text-white"
                style={{ width: `${diskLoad || 0}%` }}
              ></div>
            </div>
          </div>
        </MenuHandler>
        <MenuList className="hidden sm:flex overflow-visible border-ms-grayscale p-3 -mt-3">
          <div className="flex flex-col outline-none text-ms-fg px-2 gap-3">
            <div className="flex items-center gap-2 -mb-1.5">
              <Typography variant="h3" className="text-ms-fg">
                Laufwerke
              </Typography>

              {diskInfo.length > 1 && (
                <div className="grid grid-flow-col grid-rows-2 justify-center items-center gap-0.5 mb-0.5">
                  {[...diskInfo.keys()].map((index: number) => (
                    <div
                      key={index}
                      onClick={() => setMainDrive(index)}
                      className={`aspect-square h-[10px] cursor-pointer hover:opacity-85 ${
                        mainDrive === index ? "bg-ms-accent" : "bg-ms-grayscale-3"
                      }`}
                      title={`Mount ${diskInfo[index].mount}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 py-3 border-y border-ms-grayscale">
              <div className="w-[60px] h-auto relative">
                <CircularProgressbar
                  strokeWidth={12}
                  value={diskInfo[mainDrive].use}
                  styles={buildStyles({
                    strokeLinecap: "butt",
                    pathColor: gradientColor(diskInfo[mainDrive].use),
                    trailColor: "var(--ms-grayscale)",
                  })}
                />
                <p
                  className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] font-bold"
                  style={{ color: gradientColor(diskInfo[mainDrive].use) }}
                >
                  {Math.ceil(diskInfo[mainDrive].use)}
                </p>
              </div>

              <div className="flex flex-col justify-center min-w-[150px]">
                <div className="flex justify-start mb-0.5 gap-1 text-ms-grayscale-3">
                  <p>
                    Mount <span className="font-bold">{diskInfo[mainDrive].mount}</span> ({convertSize(diskInfo[mainDrive].size)})
                  </p>
                </div>
                <div className="flex justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <div className="aspect-square h-[10px]" style={{ backgroundColor: gradientColor(diskInfo[mainDrive].use) }}></div>
                    <p>Belegt:</p>
                  </div>
                  <p className="ml-3" title={ksep(diskInfo[mainDrive].used) + " Bytes"}>
                    {convertSize(diskInfo[mainDrive].used)}
                  </p>
                </div>

                <div className="flex justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <div className="aspect-square h-[10px] bg-ms-grayscale border border-ms-grayscale-2"></div>
                    <p>Verfügbar:</p>
                  </div>
                  <p className="ml-3" title={ksep(diskInfo[mainDrive].available) + " Bytes"}>
                    {convertSize(diskInfo[mainDrive].available)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 mb-1">
              <div className="w-[60px] h-auto relative">
                <CircularProgressbar
                  strokeWidth={12}
                  value={diskLoad}
                  styles={buildStyles({
                    strokeLinecap: "butt",
                    pathColor: gradientColor(diskLoad),
                    trailColor: "var(--ms-grayscale)",
                  })}
                />
                <p
                  className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] font-bold"
                  style={{ color: gradientColor(diskLoad) }}
                >
                  {diskLoad}
                </p>
              </div>

              <div className="flex flex-col justify-center min-w-[150px]">
                <div className="flex justify-start mb-0.5 gap-1 text-ms-grayscale-3">Gesamt ({convertSize(totalDiskInfo.size)})</div>
                <div className="flex justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <div className="aspect-square h-[10px]" style={{ backgroundColor: gradientColor(diskLoad) }}></div>
                    <p>Belegt:</p>
                  </div>
                  <p className="ml-3" title={ksep(totalDiskInfo.used) + " Bytes"}>
                    {convertSize(totalDiskInfo.used)}
                  </p>
                </div>

                <div className="flex justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <div className="aspect-square h-[10px] bg-ms-grayscale border border-ms-grayscale-2"></div>
                    <p>Verfügbar:</p>
                  </div>
                  <p className="ml-3" title={ksep(totalDiskInfo.available) + " Bytes"}>
                    {convertSize(totalDiskInfo.available)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MenuList>
      </Menu>
    </div>
  );
}
