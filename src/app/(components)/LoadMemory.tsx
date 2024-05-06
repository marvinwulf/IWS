import React, { useState, useEffect } from "react";
import { Progress, Typography, Menu, MenuHandler, MenuList } from "@material-tailwind/react";

export default function LoadMemory() {
  const [memLoad, setMemLoad] = useState<any>(["- "]);
  const [memInfo, setMemInfo] = useState<any>(["-"]);
  const [memStats, setMemStats] = useState<any>(["-"]);

  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [slots, setSlots] = useState(0);

  const [openMenu, setOpenMenu] = React.useState(false);

  useEffect(() => {
    fetchMemInfo();
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchMemInfo();
      }
    }, 16000);

    return () => clearInterval(interval);
  }, []);

  const fetchMemInfo = async () => {
    try {
      const res = await fetch("/api/system/memload");
      if (!res.ok) {
        throw new Error("Failed to fetch Memory load");
      }
      const data = await res.json();
      setMemLoad(data.totalLoad);
      setMemInfo(data.ramData);

      const res2 = await fetch("/api/system/staticinfo");
      if (!res2.ok) {
        throw new Error("Failed to fetch system info");
      }
      const data2 = await res2.json();
      setMemStats(data2.RAM);
      setSlots(data2.RAM.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function convertSize(sizeInB: number) {
    if (sizeInB >= 1024 * 1024 * 1024) {
      return (sizeInB / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    } else if (sizeInB >= 1024 * 1024) {
      return (sizeInB / (1024 * 1024)).toFixed(2) + " MB";
    } else if (sizeInB >= 1024) {
      return ((sizeInB / 1024) * 1024).toFixed(2) + " KB";
    } else {
      return sizeInB + "B";
    }
  }

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
            <div className="text-sm text-right -mr-0.5">{memLoad}%</div>
            <div className="mdi mdi-chip px-2"></div>
            <div className="w-48">
              <Progress value={memLoad === "N/A" ? 0 : parseFloat(memLoad)} color="teal" size="sm" className="bg-ms-accent" />
            </div>
          </div>
        </MenuHandler>
        <MenuList className="hidden lg:flex overflow-visible border-ms-accent p-3 -mt-3">
          <div className="flex flex-col outline-none text-ms-fg px-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Typography variant="h3" className="text-ms-fg">
                  RAM
                </Typography>

                {slots > 1 && (
                  <div className="grid grid-flow-col grid-rows-2 justify-center items-center gap-0.5 mb-0.5">
                    {[...memStats.keys()].map((index: number) => (
                      <div
                        key={index}
                        onClick={() => setSelectedSlotIndex(index)}
                        className={`aspect-square h-[10px] cursor-pointer hover:opacity-85 ${
                          selectedSlotIndex === index ? "bg-ms-colored" : "bg-ms-accent-3"
                        }`}
                        title={`Slot: ${index}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <Typography variant="h4" className="text-ms-accent-3 font-light text-end w-[110px]">
                {slots} {slots > 1 ? "Slots" : "Slot"}
              </Typography>
            </div>

            <div className="flex items-end justify-center border-y border-ms-accent mb-2 py-2 mt-1.5">
              <div>
                <p className="text-ms-accent-3 -mb-1">Belegt</p>
                <Typography
                  variant="h5"
                  className="flex text-ms-fg font-light"
                  title={`In Verwendung: ${convertSize(memInfo.used)} \nHardware Reserviert: ${convertSize(memInfo.swaptotal - memInfo.total)}`}
                >
                  {convertSize(memInfo.used + memInfo.swaptotal - memInfo.total)}
                </Typography>
              </div>
              <Typography variant="h5" className="flex text-ms-fg font-light px-2">
                /
              </Typography>
              <div>
                <p className="text-ms-accent-3 -my-1">Gesamt</p>
                <Typography variant="h5" className="flex text-ms-fg font-light">
                  {convertSize(memInfo.swaptotal)}
                </Typography>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="flex justify-between mb-0.5">
                <p>Bank:</p>
                <p>{memStats[selectedSlotIndex].bank || "-"}</p>
              </div>

              <div className="flex justify-between mb-0.5">
                <p>Kapazität:</p>
                <p>{convertSize(memStats[selectedSlotIndex].size) || "-"}</p>
              </div>

              <div className="flex justify-between mb-0.5">
                <p>Taktfrequenz:</p>
                <p>{memStats[selectedSlotIndex].clockSpeed || "-"} MHz</p>
              </div>

              <div className="flex justify-between mb-0.5">
                <p>Typ:</p>
                <p>{memStats[selectedSlotIndex].type || "-"}</p>
              </div>

              <div className="flex justify-between">
                <p>Formfaktor:</p>
                <p>{memStats[selectedSlotIndex].formFactor || "-"}</p>
              </div>
            </div>
          </div>
        </MenuList>
      </Menu>
    </div>
  );
}
