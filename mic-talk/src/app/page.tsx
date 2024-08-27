"use client";
// Import necessary hooks and components
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "../app/css/mic.css";

// Define the component with TypeScript
const Home: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestAnimationRef = useRef<number | null>(null);

  // Toggle function for RGB color cycling
  const handleClick = async () => {
    setIsClicked(!isClicked);
    if (!isClicked) {
      startAudioProcessing();
    } else {
      stopAudioProcessing();
    }
  };

  const startAudioProcessing = async () => {
    if (!audioContextRef.current) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512; // or 256 for more bars
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      analyserRef.current = analyser;
      audioContextRef.current = audioContext;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
      } catch (error) {
        console.error("Error accessing the microphone:", error);
        return;
      }
    }
    animateAudioVisualizer();
  };

  const animateAudioVisualizer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const draw = () => {
      if (!ctx || !dataArrayRef.current || !analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      dataArrayRef.current.forEach((value, i) => {
        ctx.fillRect(
          i * 12,
          canvas.height,
          10,
          -(value * (canvas.height / 256))
        ); // Draw each bar
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
    <div className="bg-gradient-to-r from-sky-300 to-fuchsia-900 h-screen w-full flex justify-center items-center">
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
      {isClicked && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
    </div>
  );
};

export default Home;
