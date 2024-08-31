"use client";
// Import necessary hooks and components
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Header from "@/components/header";
import SpeedDial from "@/components/speedDial";
import { useTheme } from "@/contextApi/darkmodeContext";
import { useModal } from "@/contextApi/modalContext";
import MicrophoneModal from "@/components/microphoneModal";
import SpeakerModal from "@/components/speakerModal";
import { useSpeaker } from "@/contextApi/speakerContext";
import { useMicrophone } from "@/contextApi/microphoneContext";
import { useVolume } from "@/contextApi/volumeContext";
import { IoSearchCircle } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Karaoke } from "@/Api/services/karoke";
import AdSense from "@/components/adsense";


const Page: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [artist, setArtist] = useState<string>("");
  const [song, setSong] = useState<any>("");
  const [responseSong, setResponseSong] = useState<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestAnimationRef = useRef<number | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const { darkMode } = useTheme();
  const { isMicModalOpen, toggleMicModal } = useModal();
  const { isSpeakerModalOpen, toggleSpeakerModal } = useModal();
  const { selectedSpeaker } = useSpeaker();
  const { selectedMic } = useMicrophone();
  const { volume } = useVolume();

  // Handle the click event on song search
  const handleSearch = async () => {
    if (!artist || !song) {
      toast.error("Please enter an artist and a song");
    } else {
      //Calling the Karoke API
      try {
        const response: any = await Karaoke(artist, song);
        if (!response) {
          toast.error("No lyrics found for the given song");
          return;
        } else if (response.error) {
          toast.error("Error occurred while calling the Karaoke API");
          console.error("Error occurred:", response.error);
          return;
        } else if (!response.lyrics) {
          toast.error("No lyrics found for the given song");
          return;
        } else if (response.lyrics === "No lyrics found") {
          toast.error("No lyrics found for the given song");
          return;
        } else {
          setResponseSong(response?.lyrics);
          toast.success("Karaoke API called successfully");
        }
      } catch (error: any) {
        toast.error("Error occurred while calling the Karaoke API");
        console.error("Error occurred:", error);
      }
    }
  };

  // Handle the click event on the microphone button
  const handleClick = async () => {
    setIsClicked(!isClicked);
  };

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
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        try {
          const audioConstraints = {
            audio: selectedMic
              ? { deviceId: { exact: selectedMic.deviceId } }
              : true,
          };
          const stream = await navigator.mediaDevices.getUserMedia(
            audioConstraints
          );
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
          }else {
            console.warn("Speaker setup not supported or speaker not selected.");
            audioElement.play();  // Fallback to default device
          }

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

  return (
    <div
      className={
        darkMode
          ? "bg-dark_background bg-cover h-screen w-full"
          : "bg-light_background bg-cover h-screen w-full"
      }
    >
      <Header />
      <ToastContainer />
      <div className="h-5/6 w-full flex flex-col flex-wrap justify-center items-center">
        <div className="flex flex-wrap justify-center items-center">
          <input
            className={
              darkMode
                ? "text-white placeholder-white w-64 md:w-96 h-10 rounded-3xl border-2 border-gray-200 p-2 bg-blue-600 m-2 p-1"
                : "text-black placeholder-black w-64 md:w-96 h-10 rounded-3xl border-2 border-gray-200 p-2 bg-blue-400 m-2 p-1"
            }
            id="search Artist"
            type="search"
            placeholder="search Artist"
            onChange={(e) => setArtist(e.target.value)}
          />
          <input
            className={
              darkMode
                ? "text-white placeholder-white w-64 md:w-96 h-10 rounded-3xl border-2 border-gray-200 p-2 bg-blue-600 m-2 p-1"
                : "text-black placeholder-black w-64 md:w-96 h-10 rounded-3xl border-2 border-gray-200 p-2 bg-blue-400 m-2 p-1"
            }
            id="search Song"
            type="search"
            placeholder="search Song"
            onChange={(e) => setSong(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap justify-center items-center">
          <button
            aria-label="Search"
            className={
              darkMode
                ? "flex justify-center items-center w-20 h-10 rounded-3xl bg-transparent m-2 hover:bg-blue-600"
                : "flex justify-center items-center w-20 h-10 rounded-3xl bg-transparent m-2 hover:bg-blue-400"
            }
            onClick={handleSearch}
          >
            <IoSearchCircle
              className={darkMode ? "text-white" : "text-black"}
              size="40px"
            />
          </button>
          <button
            aria-label="Microphone-Karaoke"
            className={
              darkMode
                ? "relative text-white w-20 h-10 rounded-3xl p-2 m-2"
                : "relative text-black w-20 h-10 rounded-3xl p-2 m-2"
            }
            onClick={handleClick}
          >
            <Image
              src="/images/mic2.jpg"
              alt="Microphone-Karaoke"
              width={30}
              height={30}
              className="rounded-full select-none"
              draggable="false"
              itemProp="image"
            />
            {/* Dot on the top left of the button, red if clicked, green otherwise */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "10px",
                height: "10px",
                backgroundColor: isClicked ? "red" : "green",
                borderRadius: "50%",
              }}
            />
          </button>
        </div>
        <p
          className={
            darkMode
              ? "text-white bg-blue-600 rounded-3xl border-2 border-gray-200 h-4/6 w-3/4 p-3 text-xl overflow-auto"
              : "text-black bg-blue-400 rounded-3xl border-2 border-gray-200 h-4/6 w-3/4 p-3 text-xl overflow-auto"
          }
        >
          {responseSong}
        </p>
      </div>
      <MicrophoneModal isOpen={isMicModalOpen} onClose={toggleMicModal} />
      <SpeakerModal isOpen={isSpeakerModalOpen} onClose={toggleSpeakerModal} />
      <SpeedDial />
      <AdSense />
    </div>
  );
};

export default Page;
