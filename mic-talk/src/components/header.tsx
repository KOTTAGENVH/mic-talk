"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contextApi/darkmodeContext";
import { useModal } from "@/contextApi/modalContext";
import { Home, Mic2, Moon, Sun, Volume2 } from "lucide-react";

function Header() {
  const router = useRouter();
  const { toggleDarkMode, darkMode } = useTheme();
  const { toggleMicModal, toggleSpeakerModal } = useModal();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-10">
      <nav
        className={`
        sticky  transition-all duration-300 ease-out w-full
        ${darkMode
            ? "bg-transparent"
            : "bg-transparent"
          } 
        backdrop-blur-2xl shadow-lg
      `}
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)"
        }}
      >
        <div className="max-w-7xl mx-auto px-3 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              className={` p-2 rounded-2xl   ${darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-white/30 hover:bg-white/50 text-slate-800"
                } backdrop-blur-sm`}
              onClick={handleLogoClick}
              aria-label="Microphone Settings"
            >
              <Home className="w-5 h-5 relative z-10" />
            </button>
            <div className="flex items-center space-x-2">
              <button
                className={` p-2 rounded-2xl   ${darkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white/30 hover:bg-white/50 text-slate-800"
                  } backdrop-blur-sm`}
                onClick={toggleSpeakerModal}
                aria-label="Speaker Settings"
              >
                <Volume2 className="w-5 h-5 relative z-10" />
              </button>
              <button
                className={` p-2 rounded-2xl   ${darkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white/30 hover:bg-white/50 text-slate-800"
                  } backdrop-blur-sm`}
                onClick={toggleMicModal}
                aria-label="Microphone Settings"
              >
                <Mic2 className="w-5 h-5 relative z-10" />
              </button>

              {/* Theme Toggle Button */}
              <button
                className={` p-2 rounded-2xl   ${darkMode
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-white/30 hover:bg-white/50 text-slate-800"
                  } backdrop-blur-sm`}
                onClick={toggleDarkMode}
                aria-label="Toggle Theme"
              >
                <div className="relative z-10 w-5 h-5 flex items-center justify-center">
                  <Sun className={`
                  absolute w-5 h-5 transition-all duration-300 
                  ${darkMode
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-180 scale-0"
                    }
                `} />
                  <Moon className={`
                  absolute w-5 h-5 transition-all duration-300 
                  ${darkMode
                      ? "opacity-0 -rotate-180 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                    }
                `} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;