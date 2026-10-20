import { useState, useEffect, useRef } from "react";
import "./App.css";

import bgImage from "./Adi1.jpg";

function Tulip({ delay = "0s", left = "50%" }) {
  return (
    <div
      className="tulip"
      style={{ left, animationDelay: delay }}
      aria-hidden="true"
    >
      <div className="flower">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="stem"></div>
      <div className="leaf leaf-left"></div>
      <div className="leaf leaf-right"></div>
    </div>
  );
}

function App() {
  const [showLetter, setShowLetter] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const audioCtxRef = useRef(null);
  const scheduledNodesRef = useRef([]);
  const isPlayingRef = useRef(false);
  const timeoutsRef = useRef([]);

  // 🎵 1 Minute 15 Second "Happy Birthday" Music Box Melody
  const playLongBirthdayMelody = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      // Create the context ONLY inside a user gesture (the click)
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;

      // Resume if suspended — must happen synchronously in the click
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // If a melody is already playing, don't start a second one
      if (isPlayingRef.current) return;
      isPlayingRef.current = true;

      const tempo = 0.4;

      // Notes: G4(392), A4(440), B4(493.88), C5(523.25), D5(587.33), E5(659.25), F5(698.46), G5(783.99)
      const song = [
        // Verse 1
        { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 1 }, { f: 392.00, d: 1 }, { f: 523.25, d: 1 }, { f: 493.88, d: 2 },
        { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 1 }, { f: 392.00, d: 1 }, { f: 587.33, d: 1 }, { f: 523.25, d: 2 },
        { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 783.99, d: 1 }, { f: 659.25, d: 1 }, { f: 523.25, d: 1 }, { f: 493.88, d: 1 }, { f: 440.00, d: 2 },
        { f: 698.46, d: 0.75 }, { f: 698.46, d: 0.25 }, { f: 659.25, d: 1 }, { f: 523.25, d: 1 }, { f: 587.33, d: 1 }, { f: 523.25, d: 2 },

        // Musical pause between verses
        { f: 0, d: 2 },

        // Verse 2 (Repeat)
        { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 1 }, { f: 392.00, d: 1 }, { f: 523.25, d: 1 }, { f: 493.88, d: 2 },
        { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 1 }, { f: 392.00, d: 1 }, { f: 587.33, d: 1 }, { f: 523.25, d: 2 },
        { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 783.99, d: 1 }, { f: 659.25, d: 1 }, { f: 523.25, d: 1 }, { f: 493.88, d: 1 }, { f: 440.00, d: 2 },
        { f: 698.46, d: 0.75 }, { f: 698.46, d: 0.25 }, { f: 659.25, d: 1 }, { f: 523.25, d: 1 }, { f: 587.33, d: 1 }, { f: 523.25, d: 2 }
      ];

      // Clear any leftover nodes from a previous run
      scheduledNodesRef.current.forEach((n) => {
        try { n.stop(); } catch (e) {}
      });
      scheduledNodesRef.current = [];

      let startTime = ctx.currentTime + 0.1;
      const nodes = [];

      song.forEach((note) => {
        if (note.f === 0) {
          startTime += note.d * tempo;
          return;
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(note.f, startTime);

        const duration = note.d * tempo;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.4);

        nodes.push(osc);
        startTime += duration;
      });

      scheduledNodesRef.current = nodes;

      // When the last note is scheduled to stop, mark as no longer playing
      const totalSeconds = startTime - (ctx.currentTime + 0.1);
      const endTimer = setTimeout(() => {
        isPlayingRef.current = false;
      }, (totalSeconds + 0.5) * 1000);
      timeoutsRef.current.push(endTimer);
    } catch (e) {
      console.log("Audio play failed:", e);
      isPlayingRef.current = false;
    }
  };

  const handleCelebrate = () => {
    // Clear previous UI timeouts if clicked again
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // 🎵 This runs synchronously inside the click handler → allowed to play
    playLongBirthdayMelody();

    setCelebrate(true);
    setShowLetter(true);
    const t = setTimeout(() => setCelebrate(false), 5000);
    timeoutsRef.current.push(t);
  };

  const closeLetter = () => setShowLetter(false);

  useEffect(() => {
    if (showLetter) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showLetter]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeLetter();
    };
    if (showLetter) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLetter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      scheduledNodesRef.current.forEach((n) => {
        try { n.stop(); } catch (e) {}
      });
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div
      className="birthday-page"
      style={{ "--bg-image": `url(${bgImage})` }}
    >
      <div className="petals" aria-hidden="true">
        <span>🌷</span>
        <span>🌸</span>
        <span>🌷</span>
        <span>🌸</span>
        <span>🌷</span>
        <span>🌸</span>
        <span>🌷</span>
      </div>

      <main className="birthday-card">
        <div className="small-title">✨ A Special Birthday Message ✨</div>

        <h1>
          Happy Birthday,
          <br />
          <span>My Adi</span> 💗
        </h1>

        <p className="intro">
          Today is a beautiful day because it celebrates your special day, you make life a little brighter, warmer, and more beautiful.
        </p>

        <div className="tulip-garden" aria-hidden="true">
          <Tulip left="8%" delay="0s" />
          <Tulip left="20%" delay="0.4s" />
          <Tulip left="34%" delay="0.8s" />
          <Tulip left="50%" delay="0.2s" />
          <Tulip left="65%" delay="0.6s" />
          <Tulip left="79%" delay="1s" />
          <Tulip left="91%" delay="0.3s" />
          <div className="grass"></div>
        </div>

        <button
          type="button"
          className="birthday-button"
          onClick={handleCelebrate}
          aria-haspopup="dialog"
          aria-expanded={showLetter}
        >
          🌷 Open 💗
        </button>

        <div className="footer-message">Made especially for you 🌷</div>
      </main>

      {showLetter && (
        <div
          className="letter-overlay"
          onClick={closeLetter}
          role="dialog"
          aria-modal="true"
          aria-labelledby="letter-title"
        >
          <div className="letter" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="letter-close"
              onClick={closeLetter}
              aria-label="Close letter"
            >
              ✕
            </button>

            <div className="letter-decoration">💗 🌷 💗</div>

            <h2 id="letter-title">Adi ❤️</h2>

            <p>Happy Birthday my Adi,</p>

            <p>
              I hope today reminds you of how wonderful, appreciated, and
              loved you are.
            </p>

            <p>
              Just like tulips blooming in spring, I hope your life continues
              to bloom with happiness, beautiful memories, and dreams coming
              true.
            </p>

            <p>
              Thank you for always being there for me and making everyday moments feel special.
            </p>

            <p className="final-message">
             May this new chapter of your life bring you everything your heart wishes for.
            </p>

            <div className="signature">
              Your love, ❤️
              <br />
              <strong>God bless you and your family. I Love You Always!🌷</strong>
            </div>
          </div>
        </div>
      )}

      {celebrate && (
        <div className="celebration" aria-hidden="true">
          <div>🎉</div>
          <div>🌷</div>
          <div>💗</div>
          <div>✨</div>
          <div>🎂</div>
          <div>🌸</div>
          <div>💐</div>
        </div>
      )}
    </div>
  );
}

export default App;