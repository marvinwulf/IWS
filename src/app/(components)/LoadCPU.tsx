import React, { useState, useEffect } from "react";
import { Progress, Typography, Menu, MenuHandler, MenuList } from "@material-tailwind/react";

export default function LoadCPU() {
  const [cpuLoad, setCpuLoad] = useState("- ");
  const [loadPerCore, setLoadPerCore] = useState<any>([]);
  const [gridClass, setGridClass] = React.useState("");

  const [systemInfo, setSystemInfo] = useState<any>([]);
  const [cacheInfo, setCacheInfo] = useState<any>([]);

  const [openMenu, setOpenMenu] = React.useState(false);
  const [coreLoadHover, setCoreLoadHover] = React.useState(false);

  useEffect(() => {
    fetchSystemInfo();
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchSystemInfo();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const res = await fetch("/api/system");
      if (!res.ok) {
        throw new Error("Failed to fetch system load");
      }
      const data = await res.json();

      setCpuLoad(data.data.cpu.totalLoad);
      setLoadPerCore(data.data.cpu.loadPerCore);

      setSystemInfo(data.data.staticInfo.CPU);
      setCacheInfo(data.data.staticInfo.CPU.cache);

      const len = data.data.cpu.loadPerCore.length;
      let gridClass = "";
      switch (true) {
        case len === 1:
          gridClass = "grid1by1";
          break;
        case len === 2:
          gridClass = "grid1by2";
          break;
        case len > 2 && len <= 4:
          gridClass = "grid2by2";
          break;
        case len > 4 && len <= 6:
          gridClass = "grid2by3";
          break;
        case len > 6 && len <= 8:
          gridClass = "grid2by4";
          break;
        case len > 8 && len <= 12:
          gridClass = "grid3by4";
          break;
        case len > 12 && len <= 16:
          gridClass = "grid4by4";
          break;
        default:
          gridClass = "grid8byauto";
          break;
      }
      setGridClass(gridClass);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const gradientColor = (load: number) => {
    const colorsData = require("/public/indicator-colormap.json");
    return colorsData[load] ? `rgb(${colorsData[load].join(", ")})` : "white";
  };

  function convertSize(sizeInKB: number) {
    if (sizeInKB >= 1024 * 1024 * 1024) {
      return (sizeInKB / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    } else if (sizeInKB >= 1024 * 1024) {
      return (sizeInKB / (1024 * 1024)).toFixed(2) + " MB";
    } else if (sizeInKB >= 1024) {
      return (sizeInKB / 1024).toFixed(2) + " KB";
    } else {
      return sizeInKB + " KB";
    }
  }

  const cpumenuhandleMouseEnter = () => setCoreLoadHover(true);
  const cpumenuhandleMouseLeave = () => setCoreLoadHover(false);

  return (
    <div className="flex gap-5">
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
            <div className="w-10 text-sm text-right -mr-0.5">{cpuLoad}%</div>
            <div className="mdi mdi-memory px-2"></div>
            <div className="flex-start flex h-1.5 w-48 overflow-hidden rounded-full bg-ms-grayscale text-xs font-medium">
              <div
                className="flex h-full items-center justify-center overflow-hidden break-all rounded-full bg-ms-primary text-white"
                style={{ width: `${cpuLoad || 0}%` }}
              ></div>
            </div>
          </div>
        </MenuHandler>
        <MenuList className="hidden sm:flex overflow-visible border-ms-grayscale p-3 ml-4 -mt-3">
          <div className="flex h-full outline-none">
            <div className="flex-1 text-ms-fg pr-6 pl-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Typography variant="h3" className="text-ms-fg">
                    CPU
                  </Typography>
                  <div
                    onMouseEnter={cpumenuhandleMouseEnter}
                    onMouseLeave={cpumenuhandleMouseLeave}
                    className="flex items-center justify-center rounded-[5px] aspect-square h-[22px] mx-2 mb-0.5 button-3"
                  >
                    <i className="mdi mdi-poll "></i>
                  </div>
                </div>
                <Typography variant="h4" className="text-ms-grayscale-3 font-light mb-[1px] text-end w-[100px]">
                  {systemInfo.speed} GHz
                </Typography>
              </div>

              <div className=" text-ms-fg -mt-0.5 pb-3 mb-3 border-b border-b-ms-grayscale">{systemInfo.brand}</div>

              <div className="flex justify-between mb-0.5">
                <p>Sockets:</p>
                <p>{systemInfo.processors}</p>
              </div>

              <div className="flex justify-between mb-0.5">
                <p>Kerne:</p>
                <p>{systemInfo.physicalCores}</p>
              </div>

              <div className="flex justify-between mb-0.5">
                <p>Logische Prozessoren:</p>
                <p>{systemInfo.cores}</p>
              </div>

              <div className="flex justify-between mb-0.5">
                <p>Virtualisation:</p>
                <p>{systemInfo.virtualization ? "Aktiviert" : "Deaktiviert"}</p>
              </div>

              <div className="flex justify-between mb-0.5">
                <p>L1-Cache:</p>
                <p>{convertSize(cacheInfo.l1d + cacheInfo.l1i || cacheInfo.l1 || "-")}</p>
              </div>

              <div className="flex justify-between mb-0.5">
                <p>L2-Cache:</p>
                <p>{convertSize(cacheInfo.l2 || "-")}</p>
              </div>

              <div className="flex justify-between">
                <p>L3-Cache:</p>
                <p>{convertSize(cacheInfo.l3 || "-")}</p>
              </div>
            </div>

            <div className={`gridpro ${gridClass} rounded-md border-ms-fg`}>
              {loadPerCore.map((load: number, index: number) => (
                <div key={index}>
                  <div
                    className="flex flex-col justify-between aspect-square min-h-[60px] hover:opacity-85"
                    title={`CPU ${index}: ${load}%`}
                    style={{ backgroundColor: gradientColor(load) }}
                  >
                    <div className={`${coreLoadHover ? "text-ms-grayscale-1" : "text-ms-hbg"} text-end px-1.5 py-0.5 text-sm tr`}>{index}</div>
                    <p className={`${coreLoadHover ? "opacity-100" : "opacity-0"} text-end px-1.5 py-0.5 text-sm text-ms-hbg cursor-default tr`}>
                      {load} %
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MenuList>
      </Menu>
    </div>
  );
}
