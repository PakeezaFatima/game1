// Save as: src/app/page.js  (Next.js App Router, JavaScript)
// Make sure Tailwind CSS is installed and globals.css imports Tailwind base/components/utilities.

"use client";

import React from "react";

export default function ClickGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <GameCard />
      </div>
    </div>
  );
}

function GameCard() {
  const [running, setRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(30); // seconds
  const [score, setScore] = React.useState(0);
  const [targetIndex, setTargetIndex] = React.useState(null);
  const [gridSize] = React.useState(9); // 3x3
  const [intervalMs] = React.useState(900); // how often target moves (ms)
  const timerRef = React.useRef(null);
  const moveRef = React.useRef(null);

  React.useEffect(() => {
    if (running) {
      // start countdown
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);

      // move target periodically
      moveTarget();
      moveRef.current = setInterval(moveTarget, intervalMs);
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(moveRef.current);
    };
  }, [running]);

  React.useEffect(() => {
    if (timeLeft <= 0 && running) {
      endGame();
    }
  }, [timeLeft]);

  function moveTarget() {
    // pick random index 0..gridSize-1 but avoid staying in same place too often
    setTargetIndex((prev) => {
      let next = Math.floor(Math.random() * gridSize);
      // if same, try once more
      if (next === prev) next = (next + 1) % gridSize;
      return next;
    });
  }

  function startGame() {
    setScore(0);
    setTimeLeft(30);
    setRunning(true);
    setTargetIndex(null);
    // small delay before first appear
    setTimeout(moveTarget, 400);
  }

  function endGame() {
    setRunning(false);
    clearInterval(timerRef.current);
    clearInterval(moveRef.current);
    setTargetIndex(null);
  }

  function handleClick(index) {
    if (!running) return;
    if (index === targetIndex) {
      setScore((s) => s + 1);
      // move immediately on hit
      moveTarget();
    }
  }

  function formatTime(t) {
    const seconds = Math.max(0, t);
    return `${seconds}s`;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Farmhouse Catch</h2>
          <p className="text-sm text-gray-600">Click the running chicken to score points!</p>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Time</div>
          <div className="text-xl font-semibold">{formatTime(timeLeft)}</div>
        </div>
      </div>

      <div className="flex gap-4 items-center mb-4">
        <div className="flex-1">
          <div className="text-sm text-gray-500">Score</div>
          <div className="text-3xl font-extrabold">{score}</div>
        </div>

        <div className="flex gap-2">
          {!running ? (
            <button onClick={startGame} className="px-4 py-2 rounded-md bg-green-700 text-white font-semibold">Start</button>
          ) : (
            <button onClick={endGame} className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold">Stop</button>
          )}

          <button
            onClick={() => {
              setScore(0);
              setTimeLeft(30);
              setTargetIndex(null);
              setRunning(false);
              clearInterval(timerRef.current);
              clearInterval(moveRef.current);
            }}
            className="px-3 py-2 rounded-md border font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: gridSize }).map((_, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(i)}
            onKeyDown={(e) => (e.key === "Enter" ? handleClick(i) : null)}
            className={`relative h-28 rounded-lg flex items-center justify-center border cursor-pointer select-none transition-transform transform ${
              i === targetIndex ? "scale-105 shadow-2xl" : "bg-amber-50"
            }`}
          >
            {i === targetIndex ? (
              <Target />
            ) : (
              <div className="text-xs text-gray-400">Tap</div>
            )}
          </div>
        ))}
      </div>

      {/* End message */}
      {!running && timeLeft <= 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-md text-center">
          <div className="font-semibold">Game Over</div>
          <div className="text-sm text-gray-600">Your final score: <span className="font-bold">{score}</span></div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">Tip: Click the target quickly — it moves every {Math.round(intervalMs / 100)}00 ms.</div>
    </div>
  );
}

function Target() {
  // simple farmhouse-themed target: a chicken SVG
  return (
    <div className="flex items-center justify-center">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" stroke="#D1FAE5" strokeWidth="2" fill="#FFF7ED" />
        <path d="M8 15c-.5-1.5-1.5-3-3-3s-2 2-2 3 1 2 2 2 2-.5 3-2z" fill="#FDE68A" />
        <path d="M17 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" fill="#FCA5A5" />
        <path d="M9 11c1.5-2.5 5-2.5 6 0 0 0 1 5-3 6-3-1-4-6-3-6z" fill="#F97316" />
        <circle cx="11.5" cy="10" r="0.9" fill="#000" />
      </svg>
    </div>
  );
}
