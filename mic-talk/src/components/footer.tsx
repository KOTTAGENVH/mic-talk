import { roboto } from '@/app/fonts';
import { useTheme } from '@/contextApi/darkmodeContext';
import React from 'react';

function Footer() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();
  return (
    <footer className={` mt-auto py-2 w-full  ${darkMode
      ? "bg-white/5  "
      : "bg-white/20  "
      } backdrop-blur-xl shadow-2xl`}
      style={{
        backdropFilter: "blur(20px)",
        boxShadow: darkMode
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
      }}>
      <div className="max-w-7xl mx-auto px-3 lg:px-6">
      <div className="justify-between items-center text-center flex flex-row flex-wrap">
        <p className={`${roboto.className} text-xs ${darkMode ? "text-white" : "text-black"} cursor-poroboto`}
          onClick={() => window.open("https://www.nowenkottage.com/", "_blank")}
        >
          © {currentYear} MicTalk. All rights reserved.
        </p>
        <a href="/legal" className={`${roboto.className} ${darkMode ? "text-white" : "text-black"} transition-colors text-xs`}>
          Legal
        </a>
      </div>
      </div>
    </footer>
  );
}

export default Footer;