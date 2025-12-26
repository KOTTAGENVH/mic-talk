"use client";
import Header from "@/components/header";
import { useTheme } from "@/contextApi/darkmodeContext";
import { inter, roboto } from "@/app/fonts";
import Footer from "@/components/footer";
import { useModal } from "@/contextApi/modalContext";
import MicrophoneModal from "@/components/microphoneModal";
import SpeakerModal from "@/components/speakerModal";


function Page() {
  const { darkMode } = useTheme();
  const { isMicModalOpen, toggleMicModal } = useModal();
  const { isSpeakerModalOpen, toggleSpeakerModal } = useModal();

  const lightBg =
    "bg-[image:linear-gradient(to_bottom,_#536976,_#BBD2C5)]";

  const darkBg =
    "bg-[image:linear-gradient(to_bottom,_#434343,_#000000)]";


  return (
    <div
      className={`${darkMode
        ? ` bg-cover min-h-screen w-full flex flex-col ${darkBg}`
        : ` bg-cover min-h-screen w-full flex flex-col ${lightBg}`
        }`}
    >
      <Header />
      <main className="flex-1 w-full pt-24 px-3 lg:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={
              darkMode
                ? "text-white bg-opacity-50 backdrop-blur-md w-full mt-8 p-8 rounded-2xl overflow-y-auto"
                : "text-black bg-opacity-50 backdrop-blur-md w-full mt-8 p-8 rounded-2xl overflow-y-auto "
            }
          >
            <p
              className={`${inter.className} text-2xl m-2 text-center`}
            >
              Terms & Conditions
            </p>
            <p className={`${roboto.className} text-lg m-2 text-left`}>
              1. I am not responsible for any damage caused to you by mictalk.
              <br />
              2.{" "}
              <a href="https://www.nowenkottage.com/">
                Coding and design rights are held by me (Nowen Kottage).
              </a>
              <br />
              3.{" "}
              <a href="https://github.com/KOTTAGENVH/mic-talk">
                The source code for MicTalk is available on Github and is liscened
                under MIT.
              </a>
              <br />
              4. No warranty is provided for Mic-Talk.
              <br />
              5. I am not liable for any indirect, incidental, or consequential
              damages arising from the use of Mic-Talk.
              <br />
              6. Users are responsible for ensuring that their use of Mic-Talk
              complies with all applicable laws and regulations.
              <br />
              7. I reserve the right to modify these Terms & Conditions at any
              time without prior notice.
              <br />
              8. I reserve the right to terminate or suspend access to Mic-Talk
              for any reason without prior notice.
              <br />
              9. Mic-Talk may contain links to third-party websites or services
              that are not owned or controlled by me. I am not responsible for the
              content or practices of any third-party websites or services.
              <br />
              10. Users are strictly prohibited from using Mic-Talk to harm others
              or engage in unlawful activities.
              <br />
              11. Karaoke lyrics in Mic-Talk are sourced from{" "}
              <a href="https://lyrics.ovh/">https://lyrics.ovh/</a>.
              <br />
              12. Mic-Talk is tested on Desktop and Mobile (iPhone XR) Devices and on browsers like Chrome and Brave.
              <br />
              13. By using Mic-Talk you agree to the above mentioned terms and conditions.
            </p>
          </div>
        </div>
      </main>
      <MicrophoneModal isOpen={isMicModalOpen} onClose={toggleMicModal} />
      <SpeakerModal isOpen={isSpeakerModalOpen} onClose={toggleSpeakerModal} />
      <Footer />
    </div>
  );
}

export default Page;
