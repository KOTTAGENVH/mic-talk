"use client";
import { useState, useEffect } from "react";
import { useMicrophone } from "@/contextApi/microphoneContext";
import { useTheme } from "@/contextApi/darkmodeContext";

const MicrophoneModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { setSelectedMic } = useMicrophone();
  const { darkMode } = useTheme();

  useEffect(() => {
    const getDevices = async () => {
      setLoading(true);
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setDevices(devices.filter((device) => device.kind === "audioinput"));
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
      setLoading(false);
    };
    if (isOpen) {
      getDevices();
    }
  }, [isOpen]);

  const handleSelectMic = (device: MediaDeviceInfo) => {
    setSelectedMic(device);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col items-center justify-center rounded-lg p-4 shadow-lg relative bg-none backdrop-blur-xl border border-gray-200">
        <h2
          className={
            darkMode
              ? "text-white text-lg font-bold"
              : "text-black text-lg font-bold"
          }
        >
          Select a Microphone
        </h2>
        <ul className="w-full">
          {loading ? (
            <li>Loading devices...</li>
          ) : devices.length > 0 ? (
            devices.map((device) => (
              <li
                key={device.deviceId}
                className={
                  darkMode
                    ? "text-white cursor-pointer hover:bg-blue-600"
                    : "text-black cursor-pointer hover:bg-blue-400"
                }
                onClick={() => handleSelectMic(device)}
              >
                {device.label || "Unnamed Microphone"}
              </li>
            ))
          ) : (
            <li className={darkMode ? "text-white" : "text-black"}>
              No devices found
            </li>
          )}
        </ul>
        <button
          className={
            darkMode
              ? "text-white self-center justify-self-center cursor-pointer hover:bg-blue-600 mt-4 py-2 px-4 bg-blue-500 text-white rounded self-center"
              : "text-black self-center justify-self-center cursor-pointer hover:bg-blue-400 mt-4 py-2 px-4 bg-blue-500 text-white rounded self-center"
          }
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MicrophoneModal;
