"use client";
import Header from "@/components/header";
import SpeedDial from "@/components/speedDial";
import { useTheme } from "@/contextApi/darkmodeContext";
import React from "react";
import { Inter } from "@next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

function Page() {
  const { darkMode } = useTheme();
  return (
    <div
      className={
        darkMode
          ? "bg-dark_background bg-cover h-screen w-full"
          : "bg-light_background bg-cover h-screen w-full"
      }
    >
      <Header />
      <div className="h-5/6 w-full flex flex-col flex-wrap justify-center items-center">
        <div
          className={
            darkMode
              ? "text-white bg-opacity-50 backdrop-blur-md h-4/5 w-10/12 xl:w-11/12 m-4 mt-8 xl:m-12 p-8 rounded-2xl overflow-y-auto"
              : "text-black bg-opacity-50 backdrop-blur-md h-4/5 w-10/12 xl:w-11/12 m-4 mt-8 xl:m-12 p-8 rounded-2xl overflow-y-auto"
          }
        >
          <p
            className={`${inter.className}text-xl xl:text-2xl m-2 text-center`}
          >
            Terms & Conditions
          </p>
          <p className={`${inter.className} text-sm xl:text-xl m-2 text-left`}>
            1. I am not responsible for any damage caused to you by our product.
            <br />
            2. All the images in Mic-Talk were sourced from Dalle-E.
            <br />
            3.{" "}
            <a href="https://www.nowenkottage.com/">
              Coding and design rights are held by me (Nowen Kottage).
            </a>
            <br />
            4.{" "}
            <a href="https://github.com/KOTTAGENVH/mic-talk">
              The source code for MicTalk is available on Github and is liscened
              under MIT.
            </a>
            <br />
            5. No warranty is provided for Mic-Talk.
            <br />
            6. I am not liable for any indirect, incidental, or consequential
            damages arising from the use of Mic-Talk.
            <br />
            7. Users are responsible for ensuring that their use of Mic-Talk
            complies with all applicable laws and regulations.
            <br />
            8. I reserve the right to modify these Terms & Conditions at any
            time without prior notice.
            <br />
            9. I reserve the right to terminate or suspend access to Mic-Talk
            for any reason without prior notice.
            <br />
            10. Mic-Talk may contain links to third-party websites or services
            that are not owned or controlled by me. I am not responsible for the
            content or practices of any third-party websites or services.
            <br />
            11. Users are strictly prohibited from using Mic-Talk to harm others
            or engage in unlawful activities.
            <br />
            12. Ads displayed in Mic-Talk are sourced from Adsterra, and I am not
            responsible for their content 
            <a href="https://adsterra.com//">https://adsterra.com//</a>.
            <br />
            13. Karaoke lyrics in Mic-Talk are sourced from{" "}
            <a href="https://lyrics.ovh/">https://lyrics.ovh/</a>.
            <br />
            14. Mic-Talk is only tested on Desktop Devices and on browsers like Chrome and Brave.
            <br />
            15. By using Mic-Talk you agree to the above mentioned terms and conditions.
          </p>
        </div>
      </div>
      <SpeedDial />
    </div>
  );
}

export default Page;
