"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "../css/mic.css";
import Header from "@/components/header";
import SpeedDial from "@/components/speedDial";
import { useTheme } from "@/contextApi/darkmodeContext";
import { useModal } from "@/contextApi/modalContext";
import MicrophoneModal from "@/components/microphoneModal";
import SpeakerModal from "@/components/speakerModal";
import { useSpeaker } from "@/contextApi/speakerContext";
import { useMicrophone } from "@/contextApi/microphoneContext";
import { useVolume } from "@/contextApi/volumeContext";

// Define the Home component
const Home: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);
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

  const animateAudioVisualizer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const draw = () => {
      if (!ctx || !dataArrayRef.current || !analyserRef.current) return;
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
    return () => stopAudioProcessing(); // Cleanup on component unmount
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
      <div className="h-5/6 w-full flex justify-center items-center">
        <div className="relative">
          {/* Display circles only on button click */}
          {/* Outermost dotted circle container */}
          {isClicked && (
            <div
              className={`absolute -inset-8 rounded-full flex items-center justify-center`}
            >
              {[...Array(24)].map((_, i) => (
                <span
                  key={i}
                  className={`dot2 ${
                    isClicked ? "animate-rgb-dots3" : ""
                  } shadow-2xl`}
                  style={{ transform: `rotate(${i * 15}deg) translate(180px)` }}
                ></span>
              ))}
            </div>
          )}
          {/* Outer dotted circle container */}
          {isClicked && (
            <div
              className={`absolute -inset-6 rounded-full flex items-center justify-center`}
            >
              {[...Array(24)].map((_, i) => (
                <span
                  key={i}
                  className={`dot1 ${
                    isClicked ? "animate-rgb-dots2" : ""
                  } shadow-2xl`}
                  style={{ transform: `rotate(${i * 15}deg) translate(160px)` }}
                ></span>
              ))}
            </div>
          )}
          {/* Inner dotted circle container */}
          {isClicked && (
            <div
              className={`absolute -inset-4 rounded-full flex items-center justify-center`}
            >
              {[...Array(24)].map((_, i) => (
                <span
                  key={i}
                  className={`dot ${
                    isClicked ? "animate-rgb-dots1" : ""
                  } shadow-2xl`}
                  style={{ transform: `rotate(${i * 15}deg) translate(140px)` }}
                ></span>
              ))}
            </div>
          )}

          <button
            onClick={handleClick}
            className="relative z-10  py-2 px-4 rounded-full w-48 md:w-auto transition-all duration-150 ease-in-out   shadow-lg hover:shadow-md active:shadow-sm transform hover:-translate-y-1 active:translate-y-1"
            aria-label="Microphone"
          >
            <Image
              src="/images/mic2.jpg"
              alt="Microphone"
              width={240}
              height={240}
              className="rounded-full select-none"
              draggable="false"
              itemProp="image"
            />
          </button>
        </div>
      </div>
      {isClicked && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
      <MicrophoneModal isOpen={isMicModalOpen} onClose={toggleMicModal} />
      <SpeakerModal isOpen={isSpeakerModalOpen} onClose={toggleSpeakerModal} />
      <SpeedDial />
    </div>
  );
};

export default Home;
