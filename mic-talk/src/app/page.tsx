"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "../css/mic.css";
import Header from "@/components/header";
import { useTheme } from "@/contextApi/darkmodeContext";
import { useModal } from "@/contextApi/modalContext";
import MicrophoneModal from "@/components/microphoneModal";
import SpeakerModal from "@/components/speakerModal";
import { useSpeaker } from "@/contextApi/speakerContext";
import { useMicrophone } from "@/contextApi/microphoneContext";
import { useVolume } from "@/contextApi/volumeContext";
import { ClipboardPaste, Loader2, Mic, MicOff, Music, Search } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Karaoke } from "@/Api/services/karoke";
import Footer from "@/components/footer";
import { inter, roboto } from "./fonts";

export default function Home() {
  const [isClicked, setIsClicked] = useState(false);
  const [responseSong, setResponseSong] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState<string>("");
  const [song, setSong] = useState<any>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestAnimationRef = useRef<number | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { darkMode } = useTheme();
  const { isMicModalOpen, toggleMicModal } = useModal();
  const { isSpeakerModalOpen, toggleSpeakerModal } = useModal();
  const { selectedSpeaker } = useSpeaker();
  const { selectedMic } = useMicrophone();
  const { volume } = useVolume();


  const handleClick = async () => {
    setIsClicked(prev => !prev);
  };

  // Handle the click event on song search
  const handleSearch = async () => {
    if (!artist || !song) {
      toast.error("Please enter an artist and a song");
    } else {
      //Calling the Karoke API
      try {
        setIsLoading(true);
        const response: any = await Karaoke(artist, song);
        if (!response) {
          toast.error("No lyrics found for the given song");
          setIsLoading(false);
          return;
        } else if (response.error) {
          toast.error("Error occurred while calling the Karaoke API");
          console.error("Error occurred:", response.error);
          setIsLoading(false);
          return;
        } else if (!response.lyrics) {
          toast.error("No lyrics found for the given song");
          setIsLoading(false);
          return;
        } else if (response.lyrics === "No lyrics found") {
          toast.error("No lyrics found for the given song");
          setIsLoading(false);
          return;
        } else {
          setResponseSong(response?.lyrics);
          toast.success("Karaoke API called successfully");
          setIsLoading(false);
        }
      } catch (error: any) {
        toast.error("Error occurred while calling the Karaoke API");
        console.error("Error occurred:", error);
        setIsLoading(false);
      }
    }
  };

  const animateAudioVisualizer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || !dataArrayRef.current || !analyserRef.current) return;

    const draw = () => {
      if (!dataArrayRef.current || !analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = darkMode ? "white" : "black";

      dataArrayRef.current.forEach((value, i) => {
        ctx.fillRect(
          i * 12,
          canvas.height,
          10,
          -(value * (canvas.height / 256))
        );
      });

      requestAnimationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };


  const stopAudioProcessing = () => {
    if (requestAnimationRef.current)
      cancelAnimationFrame(requestAnimationRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (canvasRef.current && canvasRef.current.getContext("2d")) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    return () => stopAudioProcessing();
  }, []);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      // internal pixel buffer
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      // CSS size to match container
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // scale drawing context for DPR
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!isClicked) return;

    const setupAudio = async () => {
      if (!audioContextRef.current) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        gainNodeRef.current = gainNode;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

        try {
          const audioConstraints = {
            audio: selectedMic ? { deviceId: { exact: selectedMic.deviceId } } : true,
          };
          const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
          const source = audioContext.createMediaStreamSource(stream);
          const destination = audioContext.createMediaStreamDestination();

          source.connect(analyser);
          analyser.connect(gainNode);
          gainNode.connect(destination);

          gainNode.gain.value = volume; // Control volume

          const audioElement = new Audio();
          audioElement.srcObject = destination.stream;
          if (selectedSpeaker && "setSinkId" in audioElement) {
            await audioElement.setSinkId(selectedSpeaker.deviceId);
            console.log(`Output device set to ${selectedSpeaker.label}`);
            audioElement.play();
          } else {
            console.warn("Speaker setup not supported or speaker not selected.");
            audioElement.play();  // Fallback to default device
          }

          animateAudioVisualizer();
        } catch (error) {
          console.error("Error accessing the microphone:", error);
        }
      }
    };

    setupAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isClicked, selectedMic, selectedSpeaker, volume]);

  return (
    <div
      className={`${darkMode
        ? "bg-dark_background bg-cover min-h-screen w-full flex flex-col"
        : "bg-light_background bg-cover min-h-screen w-full flex flex-col"
        }`}
    >
      <Header />
      <ToastContainer />
      <main className="flex-1 w-full px-3 lg:px-6 pt-24">
      <div className="h-auto w-full flex justify-center items-center gap-2 py-4 flex-col md:flex-row flex-wrap">
        <div
          className={`relative w-full md:w-96 h-20 rounded-2xl p-6 overflow-hidden ${darkMode ? "bg-white/5" : "bg-white/20"
            } backdrop-blur-xl shadow-2xl`}
          style={{
            backdropFilter: "blur(20px)",
            boxShadow: darkMode
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <button
          onClick={handleClick}
          className={`p-2 rounded-2xl transition-all duration-200 hover:scale-110 ${darkMode
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-white/30 hover:bg-white/50 text-black"
            } backdrop-blur-sm`}
          aria-label="Microphone"
        >
          {isClicked ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className={`w-6 h-6 ${darkMode ? "text-red-400" : "text-red-800"}`} />
          )}
        </button>
      </div>
      <div className="h-auto w-full flex justify-center items-center gap-2 py-4 md:py-6 flex-row flex-wrap">
        <input
          className={`${roboto.className} ${darkMode
              ? "text-lg text-white placeholder-white w-64 md:w-96 h-10 rounded-2xl p-2 bg-white/10 backdrop-blur-md   m-2"
              : "text-lg text-black placeholder-black w-64 md:w-96 h-10 rounded-2xl p-2 bg-white/20 backdrop-blur-md  m-2"
            }`}
          id="Search Artist"
          type="search"
          placeholder="Search Artist"
          onChange={(e) => setArtist(e.target.value)}
        />
        <input
          className={`${roboto.className} ${darkMode
              ? "text-lg text-white placeholder-white w-64 md:w-96 h-10 rounded-2xl p-2 bg-white/10 backdrop-blur-md   m-2"
              : "text-lg text-black placeholder-black w-64 md:w-96 h-10 rounded-2xl p-2 bg-white/20 backdrop-blur-md  m-2"
            }`}
          id="Search Song"
          type="search"
          placeholder="Search Song"
          onChange={(e) => setSong(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className={` p-2 rounded-2xl   ${darkMode
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-white/30 hover:bg-white/50 text-black"
            } backdrop-blur-sm hidden md:block`}
          aria-label="Search"
          disabled={isLoading}
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
      <div className="h-auto w-full flex justify-center items-center py-2 md:py-4">

        <button
          onClick={handleSearch}
          className={`md:hidden p-2 rounded-2xl   ${darkMode
            ? "bg-white/10 hover:bg-white/20 text-white"
            : "bg-white/30 hover:bg-white/50 text-black"
            } backdrop-blur-sm`}
          aria-label="Search"
          disabled={isLoading}
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
      <div className={`flex ${roboto.className} w-full justify-center items-start p-6`}>
        <div
          className={`relative w-full max-w-4xl rounded-2xl p-6  ${darkMode
            ? "bg-white/5  "
            : "bg-white/20  "
            } backdrop-blur-xl shadow-2xl`}
          style={{
            backdropFilter: "blur(20px)",
            boxShadow: darkMode
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                navigator.clipboard.readText().then((clipText) => {
                  if (clipText) {
                    setResponseSong(clipText);
                    toast.success("Lyrics pasted successfully!");
                  }
                });
              }}
              className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${darkMode
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-white/30 hover:bg-white/50 text-black"
                } backdrop-blur-sm`}
              title="Paste lyrics from clipboard"
            >
              <ClipboardPaste className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                <p className={`text-lg ${darkMode ? "text-white" : "text-black"}`}>
                  Searching for lyrics...
                </p>
              </div>
            ) : responseSong ? (
              <pre className={`whitespace-pre-wrap text-lg leading-relaxed tracking-wide ${darkMode ? "text-white/90" : "text-black"
                } font-medium`}>
                {responseSong}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Music className={`w-16 h-16 mb-4 ${darkMode ? "text-white" : "text-black"}`} />
                <p className={`text-xl mb-2 ${darkMode ? "text-white" : "text-black"}`}>
                  Enter an artist and song to get started
                </p>
                <p className={`text-sm ${darkMode ? "text-white" : "text-black"}`}>
                  Or paste lyrics using the button above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </main>
      <MicrophoneModal isOpen={isMicModalOpen} onClose={toggleMicModal} />
      <SpeakerModal isOpen={isSpeakerModalOpen} onClose={toggleSpeakerModal} />
      <Footer />
    </div>
  );
};
