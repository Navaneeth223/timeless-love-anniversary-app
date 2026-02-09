import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Heart,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Star,
  Gift,
  Lock,
  Wand2
} from "lucide-react";
import { defaultConfig } from "../data/defaultConfig";
import { loadConfig } from "../lib/storage";
import { decodeConfig } from "../lib/share";
import useTypewriter from "../hooks/useTypewriter";
import useAudio from "../hooks/useAudio";

const shimmerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const floatVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2 } }
};

function useTimeTogether(startDate) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = new Date(startDate);
  const diff = Math.max(0, now - start);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { days, hours, minutes };
}

export default function Anniversary() {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sharedConfig = useMemo(() => decodeConfig(searchParams.get("data")), [searchParams]);
  const config = sharedConfig ?? loadConfig() ?? defaultConfig;
  const [started, setStarted] = useState(false);
  const [letterMode, setLetterMode] = useState(config.letterMode);
  const [secretOpen, setSecretOpen] = useState(false);
  const [voiceNote, setVoiceNote] = useState(false);
  const [surpriseUnlocked, setSurpriseUnlocked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [activePromise, setActivePromise] = useState(null);
  const surpriseRef = useRef(null);
  const hasMusic = Boolean(config.music.source);
  const nightMode = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 0 && hour <= 4;
  }, []);

  const promises = config.promises.length ? config.promises : defaultConfig.promises;
  const promiseStars = useMemo(() => {
    return promises.map((promise, index) => ({
      id: index,
      promise,
      left: `${10 + (index * 17) % 80}%`,
      top: `${12 + (index * 23) % 70}%`,
      size: 18 + (index % 3) * 6,
      delay: `${(index * 0.6) % 3}s`
    }));
  }, [promises]);
  const skyStars = useMemo(() => {
    return Array.from({ length: 18 }).map((_, index) => ({
      id: `bg-${index}`,
      left: `${(index * 13) % 100}%`,
      top: `${(index * 19) % 100}%`,
      size: 4 + (index % 4) * 3,
      opacity: 0.3 + (index % 3) * 0.2,
      delay: `${(index * 0.4) % 3}s`
    }));
  }, []);

  const typedLetter = useTypewriter(
    letterMode === "short" ? config.shortLetter : config.longLetter,
    28,
    started
  );

  const { days, hours, minutes } = useTimeTogether(config.anniversaryDate);
  const { isPlaying, play, pause, volume, updateVolume } = useAudio(
    config.music.source,
    config.music.volume
  );

  useEffect(() => {
    if (config.surprise.unlock === "time" && started) {
      const id = setTimeout(
        () => setSurpriseUnlocked(true),
        Math.max(1, config.surprise.delaySeconds) * 1000
      );
      return () => clearTimeout(id);
    }
  }, [config.surprise, started]);

  useEffect(() => {
    if (config.surprise.unlock !== "scroll" || !surpriseRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSurpriseUnlocked(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(surpriseRef.current);
    return () => observer.disconnect();
  }, [config.surprise.unlock]);

  useEffect(() => {
    if (config.surprise.unlock !== "click") return;
    if (clickCount >= config.surprise.clickCount) setSurpriseUnlocked(true);
  }, [clickCount, config.surprise]);

  const paletteClass = useMemo(() => {
    switch (config.theme.palette) {
      case "lavender":
        return "from-lavender via-rosewater to-aurora";
      case "peach":
        return "from-peach via-rosewater to-lavender";
      default:
        return "from-rosewater via-pearl to-aurora";
    }
  }, [config.theme.palette]);

  const handleOpenGift = async () => {
    setStarted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (hasMusic) {
      await play();
    }
  };

  return (
    <div className={`relative min-h-screen ${nightMode ? "bg-moon-haze" : ""}`}>
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${paletteClass}`} />
      <div className="absolute inset-0 -z-10 bg-aurora-soft opacity-80" />

      <AnimatePresence>
        {!started && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass max-w-lg rounded-[32px] p-10 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <Gift className="h-8 w-8 text-rose-500" />
              </div>
              <h1 className="font-display text-3xl">Open Your Anniversary Gift</h1>
              <p className="mt-3 text-slate-600">
                A soft, cinematic memory created just for you.
              </p>
              <button
                className="mt-6 rounded-full bg-rose-500 px-8 py-3 text-white shadow-glow"
                onClick={handleOpenGift}
              >
                Open Gift
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative overflow-hidden px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="text-center"
            variants={floatVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-rose-500">
              Timeless Love
            </p>
            <h1 className="mt-4 font-display text-4xl sm:text-6xl">
              {config.creatorName} & {config.partnerName}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              A living memory crafted from the moments that made us.
            </p>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <div className="glass rounded-full px-6 py-3">
              <span className="font-semibold">{days}</span> days
            </div>
            <div className="glass rounded-full px-6 py-3">
              <span className="font-semibold">{hours}</span> hours
            </div>
            <div className="glass rounded-full px-6 py-3">
              <span className="font-semibold">{minutes}</span> minutes
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          {[...Array(16)].map((_, index) => (
            <span
              key={`petal-${index}`}
              className="absolute h-2 w-2 rounded-full bg-white/70 opacity-60 blur-sm"
              style={{
                left: `${(index * 7) % 100}%`,
                top: `${(index * 11) % 100}%`,
                animationDelay: `${index * 0.4}s`
              }}
            />
          ))}
        </div>
      </header>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          className={`glass flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
            hasMusic ? "" : "opacity-60"
          }`}
          onClick={() => (isPlaying ? pause() : play())}
          disabled={!hasMusic}
        >
          {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {hasMusic ? (isPlaying ? "Mute" : "Play") : "No music"}
        </button>
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs">
          <Music className="h-4 w-4" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            disabled={!hasMusic}
            onChange={(event) => updateVolume(Number(event.target.value))}
          />
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:px-10">
        <motion.div variants={shimmerVariants} initial="hidden" whileInView="visible">
          <div className="flex items-center gap-3 text-rose-500">
            <Sparkles className="h-5 w-5" />
            <h2 className="font-display text-3xl">Love Timeline</h2>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {config.timeline.map((item, index) => (
              <motion.div
                key={`${item.title}-${index}`}
                className="glass rounded-3xl p-6 transition duration-500 hover:shadow-glow"
                whileHover={{ y: -6 }}
              >
                <div className="flex items-center gap-3 text-2xl">
                  <span>{item.emoji}</span>
                  <div>
                    <h3 className="font-display text-2xl">{item.title}</h3>
                    <p className="text-xs uppercase tracking-[0.3em] text-rose-400">
                      {item.date}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <motion.div variants={shimmerVariants} initial="hidden" whileInView="visible">
            <div className="flex items-center gap-3 text-rose-500">
              <Heart className="h-5 w-5" />
              <h2 className="font-display text-3xl">Love Letter</h2>
            </div>
            <div className="mt-6 rounded-[28px] bg-paper p-8 shadow-glass">
              <p className="typewriter font-script text-xl leading-relaxed text-slate-700">
                {typedLetter}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  className={`rounded-full px-4 py-2 text-sm ${
                    letterMode === "short" ? "bg-rose-500 text-white" : "bg-white/70"
                  }`}
                  onClick={() => setLetterMode("short")}
                >
                  Short
                </button>
                <button
                  className={`rounded-full px-4 py-2 text-sm ${
                    letterMode === "long" ? "bg-rose-500 text-white" : "bg-white/70"
                  }`}
                  onClick={() => setLetterMode("long")}
                >
                  Long
                </button>
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={shimmerVariants}
            initial="hidden"
            whileInView="visible"
            className="glass rounded-[32px] p-8"
          >
            <div className="flex items-center gap-3 text-rose-500">
              <Heart className="h-5 w-5" />
              <h2 className="font-display text-2xl">Tiny Rituals</h2>
            </div>
            <p className="mt-4 text-slate-600">
              Tap the heart to unlock a secret whisper.
            </p>
            <button
              className="mt-6 flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-white"
              onDoubleClick={() => setSecretOpen((prev) => !prev)}
              onClick={() => setClickCount((prev) => prev + 1)}
            >
              <Heart className="h-4 w-4" /> Double click me
            </button>
            <AnimatePresence>
              {secretOpen && (
                <motion.div
                  className="mt-4 rounded-2xl bg-white/70 p-4 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  You are my favorite forever. 💖
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <motion.div variants={shimmerVariants} initial="hidden" whileInView="visible">
          <div className="flex items-center gap-3 text-rose-500">
            <Sparkles className="h-5 w-5" />
            <h2 className="font-display text-3xl">Memory Gallery</h2>
          </div>
          <p className="mt-3 text-slate-600">
            Drag the polaroids. Long press to hear a hidden note.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {config.photos.map((photo, index) => (
              <motion.div
                key={`photo-${index}`}
                className="relative rounded-3xl bg-white/80 p-4 shadow-glass"
                drag
                whileHover={{ rotate: -2, y: -8 }}
                onPointerDown={() => {
                  const timer = setTimeout(() => setVoiceNote(true), 600);
                  const clear = () => clearTimeout(timer);
                  window.addEventListener("pointerup", clear, { once: true });
                  window.addEventListener("pointercancel", clear, { once: true });
                }}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 via-white to-lavender">
                  {photo.src ? (
                    <img
                      src={photo.src}
                      alt={photo.caption || "memory"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Add a photo
                    </div>
                  )}
                </div>
                <p className="mt-3 text-center text-sm text-slate-600">
                  {photo.caption || "A soft memory"}
                </p>
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {voiceNote && (
              <motion.div
                className="mt-6 rounded-2xl bg-white/80 p-4 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => setVoiceNote(false)}
              >
                Voice note unlocked. Close this card to continue the journey.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-moon-haze px-6 py-20 text-white sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 text-rose-200">
            <Star className="h-5 w-5" />
            <h2 className="font-display text-3xl">Night Sky Promise</h2>
          </div>
          <p className="mt-3 text-slate-200">
            Each star holds a promise. Tap to reveal.
          </p>
          <div className="relative mt-10 h-[320px] rounded-[32px] bg-stardust/60 p-6">
            {skyStars.map((star) => (
              <span
                key={star.id}
                className="absolute rounded-full bg-white/70 blur-[1px] animate-twinkle"
                style={{
                  left: star.left,
                  top: star.top,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  animationDelay: star.delay
                }}
              />
            ))}
            {promiseStars.map((star) => (
              <button
                key={star.id}
                className="absolute text-rose-200 transition hover:scale-110"
                style={{ left: star.left, top: star.top }}
                onClick={() => setActivePromise(star.promise)}
              >
                <Star
                  className="animate-twinkle drop-shadow-[0_0_12px_rgba(255,224,244,0.6)]"
                  style={{ width: star.size, height: star.size, animationDelay: star.delay }}
                  fill="currentColor"
                  stroke="white"
                  strokeWidth="1"
                />
              </button>
            ))}
            {activePromise && (
              <motion.div
                className="absolute bottom-6 left-6 rounded-2xl bg-white/10 px-4 py-3 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {activePromise}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section ref={surpriseRef} className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <div className="flex items-center gap-3 text-rose-500">
          <Wand2 className="h-5 w-5" />
          <h2 className="font-display text-3xl">Surprise</h2>
        </div>
        <div className="mt-6 rounded-[32px] bg-white/80 p-8 shadow-glass">
          {!surpriseUnlocked ? (
            <div className="flex flex-col items-center gap-4 text-center text-slate-600">
              <Lock className="h-6 w-6 text-rose-400" />
              <p>Keep going... the surprise unlocks with {config.surprise.unlock}.</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-semibold text-rose-500">
                You are my always and my forever.
              </p>
              <p className="mt-3 text-slate-600">
                Thank you for making love feel this gentle.
              </p>
              <div className="mt-4 flex justify-center gap-2 text-2xl">
                <span className="heart-pop">❤️</span>
                <span className="heart-pop">❤️</span>
                <span className="heart-pop">❤️</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="flex items-center gap-3 text-rose-500">
          <Sparkles className="h-5 w-5" />
          <h2 className="font-display text-3xl">Our Future</h2>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {config.futureCards.map((card, index) => (
            <motion.div
              key={`${card.title}-${index}`}
              className="glass rounded-3xl p-6"
              whileHover={{ y: -8 }}
            >
              <div className="text-3xl">{card.icon}</div>
              <h3 className="mt-3 font-display text-2xl">{card.title}</h3>
              <p className="mt-2 text-slate-600">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-10 text-center text-sm text-slate-500 sm:px-10">
        Crafted By Navaneeth. ❤
      </footer>
    </div>
  );
}
