import React, { useEffect, useRef, useState } from "react";
import { registerVisitorIfNeeded } from "./firebase";

const REMOTE_AUDIO_URL = "https://firebasestorage.googleapis.com/v0/b/you-are-an-idioat.firebasestorage.app/o/You%20are%20an%20idiot__%20%5B48rz8udZBmQ%5D%20(1).mp3?alt=media&token=96bb5d40-9c3f-4a6d-85c9-d8d2f38e12b8";
const CACHE_NAME = "idiot-audio-cache";

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [started, setStarted] = useState(false);

  // Check, fetch, and cache the audio blob locally
  useEffect(() => {
    async function initCachedAudio() {
      try {
        if ("caches" in window) {
          const cache = await caches.open(CACHE_NAME);
          let response = await cache.match(REMOTE_AUDIO_URL);

          if (!response) {
            console.log("Audio not cached yet. Downloading and caching locally...");
            response = await fetch(REMOTE_AUDIO_URL);
            // Cache a cloned copy of the response
            await cache.put(REMOTE_AUDIO_URL, response.clone());
          } else {
            console.log("Audio loaded instantly from local cache!");
          }

          const blob = await response.blob();
          const localUrl = URL.createObjectURL(blob);
          setAudioSrc(localUrl);
        } else {
          // Fallback if Cache API is not supported
          setAudioSrc(REMOTE_AUDIO_URL);
        }
      } catch (err) {
        console.warn("Failed to retrieve or store audio in local cache, falling back to remote:", err);
        setAudioSrc(REMOTE_AUDIO_URL);
      }
    }

    initCachedAudio();
  }, []);

  // Handle manual activation
  const handleStartPrank = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    setStarted(true);

    // Register visitor on click for unique devices
    registerVisitorIfNeeded().catch((err) => {
      console.error("Tracking registration failed:", err);
    });

    // Play audio immediately
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Audio trigger failed:", err);
        });
    }

    // Attempt to open 2 small troll pop-ups under the trusted click context
    try {
      const currentUrl = window.location.href;
      const popupOptions = "width=420,height=320,left=150,top=150,menubar=no,toolbar=no,location=no,status=no";
      
      const p1 = window.open(currentUrl, "_blank", popupOptions);
      const p2 = window.open(currentUrl, "_blank", popupOptions);
      
      if (p1) console.log("Troll window 1 opened successfully!");
      if (p2) console.log("Troll window 2 opened successfully!");
    } catch (popupError) {
      console.warn("Could not open pop-up windows automatically (likely blocked by browser settings):", popupError);
    }
  };

  return (
    <div 
      className={`${started ? "flash-strobe" : "bg-neutral-50 text-neutral-900"} min-h-screen w-full flex flex-col justify-center items-center select-none p-4 font-serif transition-all`}
      onClick={started ? undefined : () => handleStartPrank()}
    >
      {/* Loop Audio player using local cached Object URL source once ready */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
        />
      )}

      {/* Centered main container layout matching the exact image mockup */}
      <div className="flex flex-col items-center gap-14 max-w-xl w-full">
        
        {/* Title phrase in exact natural lower case - hidden until started */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-center select-none transition-all duration-300"
          style={{ visibility: started ? "visible" : "hidden", opacity: started ? 1 : 0 }}
        >
          you are an idiot
        </h1>

        {/* 3 perfectly detailed symmetrical smiley vector outlines */}
        <div className="flex gap-8 sm:gap-14 md:gap-16 justify-center items-center">
          
          {/* Smiley 1 */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4.5" fill="none"/>
              <circle cx="34" cy="40" r="5" fill="currentColor"/>
              <circle cx="66" cy="40" r="5" fill="currentColor"/>
              <path d="M26 54 C26 74, 74 74, 74 54" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          {/* Smiley 2 */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4.5" fill="none"/>
              <circle cx="34" cy="40" r="5" fill="currentColor"/>
              <circle cx="66" cy="40" r="5" fill="currentColor"/>
              <path d="M26 54 C26 74, 74 74, 74 54" stroke="currentColor" stroke-width="4.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          {/* Smiley 3 */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4.5" fill="none"/>
              <circle cx="34" cy="40" r="5" fill="currentColor"/>
              <circle cx="66" cy="40" r="5" fill="currentColor"/>
              <path d="M26 54 C26 74, 74 74, 74 54" stroke="currentColor" stroke-width="4.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

        </div>

        {/* Start Button shown below the smileys only before activation */}
        {!started && (
          <button
            onClick={(e) => handleStartPrank(e)}
            className="px-10 py-4 font-sans text-lg font-medium tracking-widest uppercase text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-full shadow-lg hover:shadow-xl cursor-pointer"
          >
            {audioSrc ? "Iniciar / Play ▶" : "Preparando... 🔄"}
          </button>
        )}

      </div>

      {/* Subtle footer tip before starting */}
      {!started && (
        <div className="absolute bottom-6 text-xs font-sans tracking-widest opacity-60 text-center">
          Sube el volumen y presiona el botón para comenzar 🔊
        </div>
      )}
    </div>
  );
}
