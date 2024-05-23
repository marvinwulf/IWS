"use client";

import { Typography, Tooltip, Spinner, IconButton } from "@material-tailwind/react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Modal from "./(components)/Modal";

export default function Page() {
  const [devices, setDevices] = useState<any>([]);
  const [dbfetchloaded, setLoaded] = useState(false);

  const [selectedDeviceData, setSelectedDeviceData] = useState<any>([]);

  const inputRef = useRef<any>(null);

  //Name Editor constants
  const [te_inputLength, te_setInputLength] = useState(0);
  const [te_isEditing, te_setIsEditing] = useState(false);
  const te_handleEditName = () => {
    te_setIsEditing(!te_isEditing);
    te_setInputLength(selectedDeviceData.devicefriendlyname.length);
  };

  const te_handleDeviceUpdate = async () => {
    selectedDeviceData.devicefriendlyname = selectedDeviceData.devicefriendlyname || "Unbenannt";
    const updatedDevices = devices.map((device: any) => {
      if (device.devicename === selectedDeviceData.devicename) {
        return { ...device, devicefriendlyname: selectedDeviceData.devicefriendlyname };
      }
      return device;
    });

    setDevices(updatedDevices);
    te_setIsEditing(false);

    try {
      const response = await fetch("/api/fetchdb", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedDeviceData),
      });

      if (!response.ok) {
        throw new Error("Failed to update device data");
      }
    } catch (error) {
      console.error("Error updating device data:", error);
    }
  };

  const te_handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      te_handleDeviceUpdate();
    }
  };

  useEffect(() => {
    if (te_isEditing && inputRef.current != null) {
      inputRef.current.focus();
    }
  }, [te_isEditing]);

  //Device Modal Menu constants
  const [openDeviceMenu, setOpenDeviceMenu] = useState(false);
  const closeDeviceMenuHandler = () => setOpenDeviceMenu(false);

  const openDeviceMenuHandler = (devicename: any) => {
    setOpenDeviceMenu(true);
    setSelectedDeviceData(devices.find((device: any) => device.devicename === devicename));
  };

  useEffect(() => {
    const fetchDb = async () => {
      try {
        const res = await fetch("/api/fetchdb");
        if (!res.ok) {
          throw new Error("Failed to fetch Database");
        }
        const data = await res.json();
        setLoaded(true);
        setDevices(data.devices);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDb();
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
      {dbfetchloaded ? (
        <div>
          {devices.filter((device: any) => (device.currentwl === 0 && device.status === 1) || (device.battery <= 5 && device.battery != null))
            .length > 0 && (
            <>
              <span className="relative top-[26px] left-[45px] bg-ms-bg px-2 text-ms-orange text-sm">Geräte, die Aufmerksamkeit benötigen</span>
              <div className="flex px-4 mx-6 pt-8 mt-4 gap-6 flex-wrap border-t border-ms-orange">
                {devices
                  .filter((device: any) => (device.currentwl === 0 && device.status === 1) || (device.battery <= 5 && device.battery != null))
                  .map((device: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col w-52 border rounded-md overflow-hidden cursor-pointer shadow-lg shadow-gray-200 hover:shadow-gray-300 hover:scale-105 tr"
                      onClick={() => openDeviceMenuHandler(device.devicename)}
                    >
                      <div className="bg-ms-hbg border-b border-ms-accent">
                        <div className="flex items-center px-4 py-3 gap-3 -mb-0.5">
                          <div className={`aspect-square h-[8px] rounded-lg ${device.status === 1 ? "bg-ms-green" : "bg-ms-red"}`}></div>

                          <p
                            className="text-ms-fg font-light text-lg whitespace-nowrap overflow-x-clip overflow-ellipsis w-40"
                            title={device.devicefriendlyname}
                          >
                            {device.devicefriendlyname}
                          </p>
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
                      onClick={() => openDeviceMenuHandler(device.devicename)}
                    >
                      <div className="bg-ms-hbg border-b border-ms-accent">
                        <div className="flex items-center px-4 py-3 gap-3 -mb-0.5">
                          <div className={`aspect-square h-[8px] rounded-lg ${device.status === 1 ? "bg-ms-green" : "bg-ms-red"}`}></div>
                          <p
                            className="text-ms-fg font-light text-lg whitespace-nowrap overflow-x-clip overflow-ellipsis w-40"
                            title={device.devicefriendlyname}
                          >
                            {device.devicefriendlyname}
                          </p>
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
                      onClick={() => openDeviceMenuHandler(device.devicename)}
                    >
                      <div className="bg-ms-hbg border-b border-ms-accent">
                        <div className="flex items-center px-4 py-3 gap-3 -mb-0.5">
                          <div className={`aspect-square h-[8px] rounded-lg ${device.status === 1 ? "bg-ms-green" : "bg-ms-red"}`}></div>
                          <p
                            className="text-ms-fg font-light text-lg whitespace-nowrap overflow-x-clip overflow-ellipsis w-40"
                            title={device.devicefriendlyname}
                          >
                            {device.devicefriendlyname}
                          </p>
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

          {devices.length === 0 && (
            <div className="flex items-center justify-center w-full h-full pb-16">
              <div className="flex flex-col items-center justify-end w-[200px] h-[160px] overflow-hidden">
                <Image className="-mb-8" alt="No Content Cat Mascot" src="/cat-mascot-void.svg" width={200} height={200} />
                <p className="text-ms-accent-3 text-center text-lg">Noch keine IWS Geräte</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full pb-16">
          <div className="flex flex-col gap-4 items-center justify-end overflow-hidden">
            <Spinner className="h-10 w-10" />
            <p className="text-sm">Daten aktualisieren</p>
          </div>
        </div>
      )}

      <Modal isVisible={openDeviceMenu} onClose={closeDeviceMenuHandler}>
        <div className="flex">
          <div className="flex-1 bg-ms-hbg h-[80vh] w-[260px] rounded-l-md"></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3 bg-ms-hbg h-[7vh] min-h-[64px] w-[60vw] rounded-se-md border-ms-accent pb-2">
              <div className="absolute right-4">
                <IconButton variant="text" color="blue-gray" onClick={closeDeviceMenuHandler}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </IconButton>
              </div>
              <i className="mdi mdi-view-dashboard text-2xl ml-3"></i>

              {te_isEditing ? (
                <div>
                  <div className="-mb-1 -mt-1">
                    <input
                      type="text"
                      value={selectedDeviceData.devicefriendlyname}
                      onChange={(e) => {
                        setSelectedDeviceData({ ...selectedDeviceData, devicefriendlyname: e.target.value });
                        te_setInputLength(e.target.value.length);
                      }}
                      className="outline-none text-ms-fg text-2xl font-bold editing w-[55vw]"
                      maxLength={32}
                      ref={inputRef}
                      onBlur={te_handleDeviceUpdate}
                      onKeyDown={te_handleKeyDown}
                    />
                  </div>
                  <p className="text-ms-accent-3 text-sm">{te_inputLength} / 32 Zeichen</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 -mb-1 -mt-1 hover:opacity-75 hover:scale-105 tr cursor-pointer" onClick={te_handleEditName}>
                    <p className="text-ms-fg text-2xl font-bold">{selectedDeviceData.devicefriendlyname}</p>
                    <div className="mdi mdi-pencil text-lg text-ms-accent-3"></div>
                  </div>
                  <p className="text-ms-accent-3 text-sm">UID: {selectedDeviceData.devicename}</p>
                </div>
              )}
            </div>
            <div className="flex-1 bg-ms-bg rounded-md border border-ms-accent"></div>
          </div>
        </div>
      </Modal>
    </>
  );
}
