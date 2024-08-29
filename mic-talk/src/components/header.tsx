"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BiSpeaker } from "react-icons/bi";
import { FaMicrophoneAlt } from "react-icons/fa";
import { CgDarkMode } from "react-icons/cg";
import { useTheme } from "@/contextApi/darkmodeContext";
import { useModal } from "@/contextApi/modalContext";

function Header() {
  const router = useRouter();
  const { toggleDarkMode } = useTheme();
  const { toggleMicModal } = useModal();
  const { toggleSpeakerModal } = useModal();
  const { darkMode } = useTheme();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div className="sticky top-0">
      <nav className="flex items-center justify-between  bg-transparent bg-opacity-30 backdrop-blur-md p-2 ">
        <div className="flex flex-row items-center flex-shrink-0 text-white">
          <button
            className={
              darkMode
                ? "text-white bg-transparent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                : "text-black bg-transparent hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg"
            }
            onClick={toggleSpeakerModal}
            aria-label="SpeakerChanger"
          >
            <BiSpeaker />
          </button>
          <button
            className={
              darkMode
                ? "text-white bg-transparent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                : "text-black bg-transparent hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg"
            }
            onClick={toggleMicModal}
            aria-label="MicrophoneChanger"
          >
            <FaMicrophoneAlt />
          </button>
          <button
            className={
              darkMode
                ? "text-white bg-transparent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                : "text-black bg-transparent hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg"
            }
            onClick={toggleDarkMode}
            aria-label="Open Menu"
          >
            <CgDarkMode />
          </button>
        </div>
        <div
          className="flex justify-center mr-20 md:mr-40"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <Image
            src="/images/mic.jpg"
            alt="Mic Talk"
            width={40}
            height={100}
            style={{ borderRadius: "60%" }}
          />
        </div>
        <div 
             className={
              darkMode
              ? "text-white"
              : "text-black"
            }
        >
          <p>T&C</p>
        </div>
      </nav>
    </div>
  );
}

export default Header;
