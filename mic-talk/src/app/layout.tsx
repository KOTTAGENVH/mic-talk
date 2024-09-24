import { ThemeProvider } from "@/contextApi/darkmodeContext";
import { MicrophoneProvider } from "@/contextApi/microphoneContext";
import { ModalProvider } from "@/contextApi/modalContext";
import { SpeakerProvider } from "@/contextApi/speakerContext";
import { VolumeProvider } from "@/contextApi/volumeContext";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>
      <VolumeProvider>
        <SpeakerProvider>
          <ModalProvider>
            <MicrophoneProvider>
              <ThemeProvider>
                {children}
                <Script
                  src={process.env.NEXT_PUBLIC_ADSTERRA_SRC}
                  strategy="lazyOnload"
                />
              </ThemeProvider>
            </MicrophoneProvider>
          </ModalProvider>
        </SpeakerProvider>
      </VolumeProvider>
    </div>
  );
}
