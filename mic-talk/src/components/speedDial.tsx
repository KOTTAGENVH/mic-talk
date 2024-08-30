"use client";
import React, { useState, useRef } from "react";
import { LuMenuSquare } from "react-icons/lu";
import { IoVolumeHigh } from "react-icons/io5";
import { IoMdVolumeHigh } from "react-icons/io";
import { FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import { CgDarkMode } from "react-icons/cg";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contextApi/darkmodeContext";
import { useVolume } from "@/contextApi/volumeContext";

const SpeedDial: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { volume, setVolume } = useVolume();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { darkMode } = useTheme();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleKarokeClick = () => {
    router.push("/karoke");
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value) / 100); 
  };

  const getVolumeIcon = () => {
    if (volume === 0) {
      return <FaVolumeXmark />;
    } else if (volume > 0 && volume <= 0.3) {
      return <FaVolumeLow />;
    } else if (volume > 0.3 && volume <= 0.6) {
      return <IoMdVolumeHigh />;
    } else {
      return <IoVolumeHigh />;
    }
  };

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-center space-y-2">
      {isOpen && (
        <div className="flex flex-col bg-white/30 shadow-lg rounded-lg p-2 backdrop-blur-md">
          <button
            className={
              darkMode
                ? "text-white py-2 px-4 flex items-center justify-center rounded"
                : "text-black py-2 px-4 flex items-center justify-center rounded"
            }
          >
            {getVolumeIcon()}
          </button>

          <input
            title="Volume"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className={
              darkMode ? "text-white mt-4 w-full" : "text-black mt-4 w-full"
            }
          />
          <button
            className={
              darkMode
                ? "text-white py-2 px-4 hover:bg-blue-600 rounded"
                : "text-black py-2 px-4 hover:bg-blue-400 rounded"
            }
            onClick={handleKarokeClick}
          >
            Karoke
          </button>
          <button
            className={
              darkMode
                ? "text-white py-2 px-4 hover:bg-blue-600 rounded"
                : "text-black py-2 px-4 hover:bg-blue-400 rounded"
            }
            onClick={handleHomeClick}
          >
            Home
          </button>
        </div>
      )}
      <button
        onClick={toggleMenu}
        aria-label="Open Menu"
        className={
          darkMode
            ? "text-white bg-blue/30 p-4 rounded-full shadow-lg backdrop-blur-md hover:bg-blue-600"
            : "text-black bg-blue/30 p-4 rounded-full shadow-lg backdrop-blur-md hover:bg-blue-400"
        }
      >
        <LuMenuSquare />
      </button>
    </div>
  );
};

export default SpeedDial;
