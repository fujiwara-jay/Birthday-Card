import { useState, useEffect } from "react";
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

  const handleCelebrate = () => {
    setCelebrate(true);
    setShowLetter(true);
    setTimeout(() => setCelebrate(false), 4000);
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
          <span>My Special Someone</span> 💗
        </h1>

        <p className="intro">
          Today is a beautiful day because it celebrates someone who makes
          life a little brighter, warmer, and more beautiful.
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
          🌷 Open Your Birthday Surprise 🌷
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

            <h2 id="letter-title">For You ❤️</h2>

            <p>Happy Birthday to someone very special to me.</p>

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
              Thank you for being someone who makes ordinary moments feel a
              little more special.
            </p>

            <p className="final-message">
              May this new chapter of your life bring you everything your
              heart wishes for.
            </p>

            <div className="signature">
              With love, ❤️
              <br />
              <strong>Someone who cares about you 🌷</strong>
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