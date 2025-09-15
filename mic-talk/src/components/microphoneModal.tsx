"use client";
import { useState, useEffect } from "react";
import { useMicrophone } from "@/contextApi/microphoneContext";
import { useTheme } from "@/contextApi/darkmodeContext";
import { X } from "lucide-react";

const MicrophoneModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedMic, setSelectedMic } = useMicrophone(); 
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
    <div
      className={`fixed inset-0 z-[9999] ${
        darkMode ? "bg-black/80" : "bg-white/80"
      } flex justify-center items-center`}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center justify-center rounded-lg p-6 shadow-lg 
                   bg-white/10 dark:bg-black/20 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
            darkMode
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-white/30 hover:bg-white/50 text-slate-800"
          }`}
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2
          className={`text-lg font-bold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Select a Microphone
        </h2>
        {selectedMic && (
          <p
            className={`mt-2 mb-4 text-sm italic ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Currently using:{" "}
            <span className="font-medium">
              {selectedMic.label || "Unnamed Microphone"}
            </span>
          </p>
        )}

        <ul className="w-full space-y-2">
          {loading ? (
            <li>Loading devices...</li>
          ) : devices.length > 0 ? (
            devices.map((device) => (
              <li
                key={device.deviceId}
                className={`cursor-pointer px-3 py-2 rounded-md transition ${
                  selectedMic?.deviceId === device.deviceId
                    ? darkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-400 text-black"
                    : darkMode
                    ? "text-white hover:bg-blue-600"
                    : "text-black hover:bg-blue-400"
                }`}
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
      </div>
    </div>
  );
};

export default MicrophoneModal;
