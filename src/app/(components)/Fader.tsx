import React, { useState, useEffect, useCallback, useRef } from "react";

interface SelectorFaderProps {
  minValue: number;
  maxValue: number;
  initialValue: number;
  settingName: string;
  bgColor: string;
  dotColor: string;
  fgColor: string;
  apiDeviceParam: string;
  onFaderEdited: () => void; // New prop for handling fader edited
}

const SelectorFader: React.FC<SelectorFaderProps> = ({
  minValue,
  maxValue,
  initialValue,
  settingName,
  bgColor,
  fgColor,
  dotColor,
  apiDeviceParam,
  onFaderEdited, // Pass the prop
}) => {
  const [value, setValue] = useState(initialValue);
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleApiCall = async (newValue: number) => {
    try {
      const response = await fetch("/api/fetchdb", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ devicename: apiDeviceParam, threshold: Math.round(newValue) }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("API call failed", error);
    }
  };

  // Dragging interaction functions
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true);
  };

  const handleMouseDrag = useCallback(
    (e: MouseEvent) => {
      if (dragging && sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const newValue = Math.min(maxValue, Math.max(minValue, ((e.clientX - rect.left) / rect.width) * (maxValue - minValue) + minValue));
        setValue(newValue);
      }
    },
    [dragging, minValue, maxValue]
  );

  const handleMouseRelease = useCallback(() => {
    setDragging(false);
    window.removeEventListener("mouseup", handleMouseRelease);
    window.removeEventListener("mousemove", handleMouseDrag);
    document.body.classList.remove("no-select");
  }, [value]);

  // Hook for dragging action
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mouseup", handleMouseRelease);
      window.addEventListener("mousemove", handleMouseDrag);
      document.body.classList.add("no-select");
      onFaderEdited(); // Call the callback function when fader is dragged
    }

    return () => {
      window.removeEventListener("mouseup", handleMouseRelease);
      window.removeEventListener("mousemove", handleMouseDrag);
      document.body.classList.remove("no-select");
    };
  }, [dragging, handleMouseDrag, handleMouseRelease, onFaderEdited]);

  // Click alternative to dragging
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const newValue = Math.min(maxValue, Math.max(minValue, ((e.clientX - rect.left) / rect.width) * (maxValue - minValue) + minValue));
      setValue(newValue);
      handleApiCall(Math.round(newValue));
    }
  };

  return (
    <div className="relative w-full">
      <div ref={sliderRef} className="relative w-full h-2.5 cursor-pointer" onMouseDown={handleMouseDown} onClick={handleClick}>
        <div
          className={`absolute top-0 left-0 h-full ${fgColor} rounded-l-full`}
          style={{
            width: `${((value - minValue) / (maxValue - minValue)) * 100}%`,
          }}
        />
        <div
          className={`absolute top-0 right-0 h-full ${bgColor} rounded-r-full`}
          style={{
            width: `${(1 - (value - minValue) / (maxValue - minValue)) * 100}%`,
          }}
        />
        <div className="relative mx-[5px]">
          <div
            className={`absolute top-[5px] left-0 aspect-square h-4 rounded-full border-ms-bg border-2 ${dotColor} transform -translate-x-1/2 -translate-y-1/2`}
            style={{
              left: `${((value - minValue) / (maxValue - minValue)) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center relative top-2 w-full text-sm mb-2">
        <p>{settingName}</p>
        <input
          type="text"
          value={Math.round(value) + " %"}
          disabled={true}
          className="w-16 border border-ms-grayscale rounded-md text-center outline-none"
        />
      </div>
    </div>
  );
};

export default SelectorFader;
