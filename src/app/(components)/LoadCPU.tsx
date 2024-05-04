import React, { useState, useEffect } from "react";
import { Progress, Typography, Menu, MenuHandler, MenuList } from "@material-tailwind/react";

export default function CPUDisplay() {
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
      const res = await fetch("/api/system/cpuload");
      if (!res.ok) {
        throw new Error("Failed to fetch CPU load");
      }
      const data = await res.json();
      setCpuLoad(data.totalLoad);
      setLoadPerCore(data.loadPerCore);

      const res2 = await fetch("/api/system/staticinfo");
      if (!res2.ok) {
        throw new Error("Failed to fetch system info");
      }
      const data2 = await res2.json();
      setSystemInfo(data2.CPU);
      setCacheInfo(data2.CPU.cache);

      const len = data.loadPerCore.length;
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
            <div className="w-48">
              <Progress value={cpuLoad === "N/A" ? 0 : parseFloat(cpuLoad)} color="teal" size="sm" className="bg-ms-accent" />
            </div>
          </div>
        </MenuHandler>
        <MenuList className="hidden lg:flex overflow-visible border-ms-accent p-3 ml-4 -mt-3">
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
                <Typography variant="h4" className="text-ms-sec-text font-light text-end w-[100px]">
                  {systemInfo.speed} GHz
                </Typography>
              </div>

              <div className=" text-ms-fg -mt-0.5 mb-4">{systemInfo.brand}</div>

              <div className="flex justify-between mb-0.5">
                <div>Sockets:</div>
                <div>{systemInfo.processors}</div>
              </div>

              <div className="flex justify-between mb-0.5">
                <div>Kerne:</div>
                <div>{systemInfo.physicalCores}</div>
              </div>

              <div className="flex justify-between mb-0.5">
                <div>Logische Prozessoren:</div>
                <div>{systemInfo.cores}</div>
              </div>

              <div className="flex justify-between mb-0.5">
                <div>Virtualisation:</div>
                <div>{systemInfo.virtualization ? "Aktiviert" : "Deaktiviert"}</div>
              </div>

              <div className="flex justify-between mb-0.5">
                <div>L1-Cache:</div>
                <div>{convertSize(cacheInfo.l1d + cacheInfo.l1i || cacheInfo.l1 || "-")}</div>
              </div>

              <div className="flex justify-between mb-0.5">
                <div>L2-Cache:</div>
                <div>{convertSize(cacheInfo.l2 || "-")}</div>
              </div>

              <div className="flex justify-between">
                <div>L3-Cache:</div>
                <div>{convertSize(cacheInfo.l3 || "-")}</div>
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
                    <div className={`${coreLoadHover ? "text-ms-accent-1" : "text-ms-hbg"} text-end px-1.5 py-0.5 text-sm tr`}>{index}</div>
                    <div className={`${coreLoadHover ? "opacity-100" : "opacity-0"} text-end px-1.5 py-0.5 text-sm text-ms-hbg cursor-default tr`}>
                      {load} %
                    </div>
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
