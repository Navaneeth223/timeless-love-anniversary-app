import { useEffect, useRef, useState } from "react";

export default function useAudio(src, initialVolume = 0.6) {
  const audioRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    const onCanPlay = () => setIsReady(true);
    const onError = () => setIsReady(false);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [src]);

  const fadeTo = (target, duration = 1000) => {
    const audio = audioRef.current;
    if (!audio) return;

    const steps = 20;
    const stepTime = duration / steps;
    const start = audio.volume;
    const delta = (target - start) / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      audio.volume = Math.max(0, Math.min(1, start + delta * current));
      if (current >= steps) clearInterval(interval);
    }, stepTime);
  };

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      fadeTo(volume, 1200);
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio play failed", error);
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeTo(0, 800);
    setTimeout(() => {
      audio.pause();
      setIsPlaying(false);
    }, 850);
  };

  const updateVolume = (nextVolume) => {
    setVolume(nextVolume);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = nextVolume;
  };

  return {
    isReady,
    isPlaying,
    volume,
    play,
    pause,
    updateVolume
  };
}
