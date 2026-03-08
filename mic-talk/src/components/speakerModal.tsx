"use client";

import React, { useState, useEffect } from "react";
import { useSpeaker } from "@/contextApi/speakerContext";
import { useTheme } from "@/contextApi/darkmodeContext";
import { X } from "lucide-react";

const SpeakerModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedSpeaker, setSelectedSpeaker } = useSpeaker(); 
  const { darkMode } = useTheme();

  useEffect(() => {
    const getDevices = async () => {
      setLoading(true);
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputDevices = devices.filter(
          (device) => device.kind === "audiooutput"
        );
        setDevices(audioOutputDevices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
      setLoading(false);
    };

    if (isOpen) {
      getDevices();
    }
  }, [isOpen]);

  const handleSelectSpeaker = async (device: MediaDeviceInfo) => {
    setSelectedSpeaker(device);
    onClose();
    const mediaElement =
      document.querySelector("audio") || document.querySelector("video");
    if (mediaElement && "setSinkId" in mediaElement && device.deviceId) {
      try {
        await mediaElement.setSinkId(device.deviceId);
        console.log(`Audio output device set to ${device.label}`);
      } catch (error) {
        console.error("Failed to set audio output device:", error);
      }
    }
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
        className="relative flex flex-col items-center justify-center rounded-lg p-6 pt-12 min-w-[320px] shadow-lg 
                   bg-white/10 dark:bg-black/20 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()} // prevent modal from closing when clicking inside
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer ${
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
          Select a Speaker
        </h2>
        {selectedSpeaker && (
          <p
            className={`mt-2 mb-4 text-sm italic ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Currently using:{" "}
            <span className="font-medium">
              {selectedSpeaker.label || "Unnamed Speaker"}
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
                  selectedSpeaker?.deviceId === device.deviceId
                    ? darkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-400 text-black"
                    : darkMode
                    ? "text-white hover:bg-blue-600"
                    : "text-black hover:bg-blue-400"
                }`}
                onClick={() => handleSelectSpeaker(device)}
              >
                {device.label || "Unnamed Speaker"}
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

export default SpeakerModal;
