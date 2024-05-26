"use client";

import { Progress, Tooltip, Spinner, IconButton } from "@material-tailwind/react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Modal from "./(components)/Modal";
import SelectorFader from "./(components)/Fader";
import SelectorFader2 from "./(components)/Fader2";

// Define device type
interface Device {
  devicename: string;
  devicefriendlyname: string;
  status: number;
  currentwl: number;
  battery: number | null;
  currentsoilhumid: number;
  threshold?: number;
  watervolume?: number;
}

interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}

const DeviceCard = ({ device, onClick }: DeviceCardProps) => {
  const getBatteryIconClass = (batteryPercentage: number | null): string => {
    if (batteryPercentage === null) return `mdi mdi-battery-alert text-ms-orange`;

    const roundedPercentage = Math.round(batteryPercentage / 10) * 10;
    if (batteryPercentage <= 10 && batteryPercentage > 5) {
      return `mdi mdi-battery-${roundedPercentage} text-ms-orange`;
    } else if (batteryPercentage <= 5) {
      return `mdi mdi-battery-${roundedPercentage} text-ms-red blinkanim`;
    } else {
      return `mdi mdi-battery-${roundedPercentage}`;
    }
  };

  const getWlIndicatorColors = (currentwl: number, indicatorBar: 0 | 1 | 2): string => {
    const colors: { [key in 0 | 1 | 2]: string[] } = {
      0: ["bg-ms-red", "bg-ms-orange", "bg-ms-green"],
      1: ["bg-ms-accent", "bg-ms-orange", "bg-ms-green"],
      2: ["bg-ms-accent", "bg-ms-accent", "bg-ms-green"],
    };
    return colors[indicatorBar][currentwl];
  };

  return (
    <div
      className="flex flex-col w-52 border rounded-md overflow-hidden cursor-pointer shadow-lg shadow-gray-200 hover:shadow-gray-300 hover:scale-105 tr"
      onClick={onClick}
    >
      <div className="bg-ms-hbg border-b border-ms-accent">
        <div className="flex items-center px-4 py-3 gap-3 -mb-0.5">
          <div className={`aspect-square h-[8px] rounded-lg ${device.status === 1 ? "bg-ms-green" : "bg-ms-red"}`}></div>
          <p className="text-ms-fg font-light text-lg whitespace-nowrap overflow-x-clip overflow-ellipsis w-40" title={device.devicefriendlyname}>
            {device.devicefriendlyname}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-grow bg-ms-bg my-4 ml-4 pr-2 gap-0.5">
          <div className={`h-2 w-[33%] rounded-l-md ${getWlIndicatorColors(device.currentwl, 0)}`}></div>
          <div className={`h-2 w-[33%] ${getWlIndicatorColors(device.currentwl, 1)}`}></div>
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
            <i className={`text-center text-lg text-ms-fg ${getBatteryIconClass(device.battery)}`}></i>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default function Page() {
  const [key, setKey] = useState<number>(0);
  const [devices, setDevices] = useState<Device[]>([]);
  const [dbfetchloaded, setLoaded] = useState<boolean>(false);
  const [selectedDeviceData, setSelectedDeviceData] = useState<Device | null>(null);
  const [te_isEditing, te_setIsEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [openDeviceMenu, setOpenDeviceMenu] = useState<boolean>(false);
  const [te_inputLength, te_setInputLength] = useState<number>(0);
  const [isFaderEdited, setIsFaderEdited] = useState(false);

  const te_handleEditName = () => {
    te_setIsEditing(!te_isEditing);
    if (selectedDeviceData) {
      te_setInputLength(selectedDeviceData.devicefriendlyname.length);
    }
  };

  const te_handleDeviceUpdate = async () => {
    if (!selectedDeviceData) return;

    const updatedDevice = { ...selectedDeviceData, devicefriendlyname: selectedDeviceData.devicefriendlyname || "Unbenannt" };

    const updatedDevices = devices.map((device) => (device.devicename === updatedDevice.devicename ? updatedDevice : device));

    setDevices(updatedDevices);
    te_setIsEditing(false);

    try {
      const response = await fetch("/api/fetchdb", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDevice),
      });

      if (!response.ok) {
        throw new Error("Failed to update device data");
      }
    } catch (error) {
      console.error("Error updating device data:", error);
    }
  };

  const te_handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      te_handleDeviceUpdate();
    }
  };

  useEffect(() => {
    if (te_isEditing && inputRef.current != null) {
      inputRef.current.focus();
    }
  }, [te_isEditing]);

  const closeDeviceMenuHandler = () => {
    setOpenDeviceMenu(false);
    te_setIsEditing(false);
    if (isFaderEdited) {
      setSelectedDeviceData(null);
      fetchDb();
      setIsFaderEdited(false);
    }
  };

  const handleFaderEdited = () => {
    setIsFaderEdited(true);
  };

  const openDeviceMenuHandler = (devicename: string) => {
    setOpenDeviceMenu(true);
    const device = devices.find((device) => device.devicename === devicename);
    if (device) {
      setSelectedDeviceData(device);
      setKey((prevKey) => prevKey + 1);
    }
  };

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

  useEffect(() => {
    fetchDb();
  }, []);

  const renderDeviceSection = (title: string, filterCondition: (device: Device) => boolean) => (
    <>
      <span className="relative top-[26px] left-[45px] bg-ms-bg px-2 text-ms-accent-2 text-sm">{title}</span>
      <div className="flex px-4 mx-6 pt-8 mt-4 gap-6 flex-wrap border-t border-ms-accent-1">
        {devices.filter(filterCondition).map((device, index) => (
          <DeviceCard key={index} device={device} onClick={() => openDeviceMenuHandler(device.devicename)} />
        ))}
      </div>
    </>
  );

  return (
    <>
      {dbfetchloaded ? (
        <div>
          {devices.some((device) => (device.currentwl === 0 && device.status === 1) || (device.battery !== null && device.battery <= 5)) &&
            renderDeviceSection(
              "Geräte, die Aufmerksamkeit benötigen",
              (device) => (device.currentwl === 0 && device.status === 1) || (device.battery !== null && device.battery <= 5)
            )}

          {devices.some((device) => device.currentwl !== 0 && device.status === 1 && (device.battery === null || device.battery > 5)) &&
            renderDeviceSection(
              "Geräte: Online",
              (device) => device.currentwl !== 0 && device.status === 1 && (device.battery === null || device.battery > 5)
            )}

          {devices.some((device) => device.status === 0) && renderDeviceSection("Geräte: Offline", (device) => device.status === 0)}

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

      {openDeviceMenu && selectedDeviceData && (
        <Modal isVisible={openDeviceMenu} onClose={closeDeviceMenuHandler} key={key}>
          <div className="flex">
            <div className="flex-1 bg-ms-hbg h-[80vh] w-[260px] rounded-l-md pr-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 bg-ms-bg p-4 border border-ms-accent rounded-md">
                  <p className="text-sm">Bodenfeuchte %</p>
                  <div className="relative w-full">
                    <Progress value={selectedDeviceData.currentsoilhumid} color="teal" size="md" className="bg-ms-accent mb-5" />
                    <div
                      className={`absolute top-[22px] left-0 h-3 w-0.5 rounded-full bg-ms-accent-2 transform -translate-x-1/2 -translate-y-1/2`}
                      style={{
                        left: `${Math.min(Math.max(2.5, selectedDeviceData.currentsoilhumid - 1), 97.5)}%`,
                      }}
                    />
                  </div>
                  <SelectorFader
                    minValue={0}
                    maxValue={100}
                    initialValue={selectedDeviceData.threshold || 0}
                    settingName="Schwellenwert"
                    fgColor="bg-ms-red"
                    dotColor="bg-ms-fg"
                    bgColor="bg-ms-colored"
                    apiDeviceParam={selectedDeviceData.devicename}
                    onFaderEdited={handleFaderEdited}
                  />
                </div>
                <div className="flex flex-col gap-4 bg-ms-bg p-4 border border-ms-accent rounded-md">
                  <SelectorFader2
                    minValue={0}
                    maxValue={10000}
                    initialValue={selectedDeviceData.watervolume || 0}
                    settingName="Pumpvolumen"
                    fgColor="bg-ms-fg"
                    dotColor="bg-ms-fg"
                    bgColor="bg-ms-accent"
                    apiDeviceParam={selectedDeviceData.devicename}
                    onFaderEdited={handleFaderEdited}
                  />
                </div>
              </div>
            </div>
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
                    <div
                      className="flex items-center gap-2 -mb-1 -mt-1 hover:opacity-75 hover:scale-105 tr cursor-pointer"
                      onClick={te_handleEditName}
                    >
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
      )}
    </>
  );
}
