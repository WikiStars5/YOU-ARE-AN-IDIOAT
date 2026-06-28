import React, { useEffect, useRef, useState } from "react";
import { registerVisitorIfNeeded, registerPageClick } from "./firebase";

const REMOTE_AUDIO_URL = "https://firebasestorage.googleapis.com/v0/b/you-are-an-idioat.firebasestorage.app/o/You%20are%20an%20idiot__%20%5B48rz8udZBmQ%5D%20(1).mp3?alt=media&token=96bb5d40-9c3f-4a6d-85c9-d8d2f38e12b8";
const CACHE_NAME = "idiot-audio-cache";

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [started, setStarted] = useState(false);

  // Determine current prank stage/page from the query parameters
  const pageParam = new URLSearchParams(window.location.search).get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

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

  // Handle manual activation based on the current page level
  const handleStartPrank = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    setStarted(true);

    // Register general visitor on first click
    registerVisitorIfNeeded().catch((err) => {
      console.error("General tracking registration failed:", err);
    });

    // Register page-specific clicks in Firestore
    registerPageClick(currentPage).catch((err) => {
      console.error(`Page ${currentPage} tracking failed:`, err);
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

    // Troll popup routing logic
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      const popupOptions = "width=420,height=320,left=150,top=150,menubar=no,toolbar=no,location=no,status=no";

      if (currentPage === 1) {
        // Page 1 opens 2 popups pointing to Page 2
        const p1 = window.open(`${baseUrl}?page=2`, "_blank", popupOptions);
        const p2 = window.open(`${baseUrl}?page=2`, "_blank", popupOptions);
        if (p1) console.log("Troll window 1 (page 2) opened successfully!");
        if (p2) console.log("Troll window 2 (page 2) opened successfully!");
      } else if (currentPage === 2) {
        // Page 2 opens 1 popup pointing to Page 3
        const p3 = window.open(`${baseUrl}?page=3`, "_blank", popupOptions);
        if (p3) console.log("Troll window 3 (page 3) opened successfully!");
      }
    } catch (popupError) {
      console.warn("Could not open pop-up windows automatically:", popupError);
    }
  };

  // Determine title text based on page level
  const titleText = currentPage === 3 ? "You really are an idiot." : "you are an idiot";
  
  // Decide if title is visible (hidden on Page 1 until started, visible immediately on Page 2 and 3)
  const isTitleVisible = started || currentPage > 1;

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
        
        {/* Title phrase - custom per page level */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-center select-none transition-all duration-300"
          style={{ visibility: isTitleVisible ? "visible" : "hidden", opacity: isTitleVisible ? 1 : 0 }}
        >
          {titleText}
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
              <path d="M26 54 C26 74, 74 74, 74 54" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          {/* Smiley 3 */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4.5" fill="none"/>
              <circle cx="34" cy="40" r="5" fill="currentColor"/>
              <circle cx="66" cy="40" r="5" fill="currentColor"/>
              <path d="M26 54 C26 74, 74 74, 74 54" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

        </div>

        {/* Start Button shown below the smileys only before activation (Pages 1 & 2 only) */}
        {!started && currentPage < 3 && (
          <button
            onClick={(e) => handleStartPrank(e)}
            className="px-10 py-4 font-sans text-lg font-medium tracking-widest uppercase text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-full shadow-lg hover:shadow-xl cursor-pointer"
          >
            {audioSrc 
              ? (currentPage === 2 ? "Parar 🛑" : "Iniciar / Play ▶") 
              : "Preparando... 🔄"}
          </button>
        )}

      </div>

      {/* Subtle footer tip before starting */}
      {!started && (
        <div className="absolute bottom-6 text-xs font-sans tracking-widest opacity-60 text-center px-4">
          {currentPage === 3 
            ? "Toca en cualquier parte de la pantalla para activar 🔊" 
            : "Sube el volumen y presiona el botón para comenzar 🔊"}
        </div>
      )}
    </div>
  );
}
