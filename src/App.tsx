import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Automatically attempt to play on load and register global events to unblock immediately on any action
  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            removeListeners();
          })
          .catch((err) => {
            console.log("Autoplay blocked or pending interaction:", err);
          });
      }
    };

    const removeListeners = () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
      window.removeEventListener("keydown", startAudio);
      window.removeEventListener("mousedown", startAudio);
    };

    // Attach listeners
    window.addEventListener("click", startAudio);
    window.addEventListener("touchstart", startAudio);
    window.addEventListener("keydown", startAudio);
    window.addEventListener("mousedown", startAudio);

    // Attempt immediately on mount
    startAudio();

    return () => {
      removeListeners();
    };
  }, []);

  return (
    <div 
      className="flash-strobe min-h-screen w-full flex flex-col justify-center items-center select-none p-4 font-serif transition-all cursor-pointer"
    >
      {/* Loop Audio player using the requested Firebase Storage audio link */}
      <audio
        ref={audioRef}
        src="https://firebasestorage.googleapis.com/v0/b/you-are-an-idioat.firebasestorage.app/o/You%20are%20an%20idiot__%20%5B48rz8udZBmQ%5D%20(1).mp3?alt=media&token=96bb5d40-9c3f-4a6d-85c9-d8d2f38e12b8"
        loop
        autoPlay
      />

      {/* Centered main container layout matching the exact image mockup */}
      <div className="flex flex-col items-center gap-14 max-w-xl w-full">
        
        {/* Title phrase in exact natural lower case */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-center select-none">
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
              <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="4.5" fill="none"/>
              <circle cx="34" cy="40" r="5" fill="currentColor"/>
              <circle cx="66" cy="40" r="5" fill="currentColor"/>
              <path d="M26 54 C26 74, 74 74, 74 54" stroke="currentColor" stroke-width="4.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

        </div>

      </div>

      {/* Subtle interaction cue if browser blocks early autoplay */}
      {!isPlaying && (
        <div className="absolute bottom-6 text-xs font-sans tracking-widest opacity-60 animate-pulse text-center">
          Haz clic en cualquier parte para activar la música 🔊
        </div>
      )}
    </div>
  );
}
