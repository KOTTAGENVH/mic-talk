import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contextApi/darkmodeContext";
import { MicrophoneProvider } from "@/contextApi/microphoneContext";
import { ModalProvider } from "@/contextApi/modalContext";
import { SpeakerProvider } from "@/contextApi/speakerContext";
import { VolumeProvider } from "@/contextApi/volumeContext";
import AdSense from "@/components/adsense";

const inter = Inter({ subsets: ["latin"] });
const adClient = process.env.AD_CLIENT as string;
export const metadata: Metadata = {
  title: "Mic-Talk",
  description: "Mic Talk by Nowen Kottage (`www.nowenkottage.com`)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AdSense />
        <VolumeProvider>
          <SpeakerProvider>
            <ModalProvider>
              <MicrophoneProvider>
                <ThemeProvider>
                  {children}
                </ThemeProvider>
              </MicrophoneProvider>
            </ModalProvider>
          </SpeakerProvider>
        </VolumeProvider>
      </body>
    </html>
  );
}
