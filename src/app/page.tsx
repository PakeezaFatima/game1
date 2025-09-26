"use client";

import React from "react";

export default function Home() {
  const [score, setScore] = React.useState(0);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-purple-700">Click Counter Game 🎮</h1>
        <p className="text-gray-600 mb-6">
          Click the button as many times as you can!
        </p>

        <div className="text-5xl font-extrabold text-blue-600 mb-6">{score}</div>

        <button
          onClick={() => setScore(score + 1)}
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl shadow hover:bg-blue-700 transition"
        >
          Click Me!
        </button>

        <button
          onClick={() => setScore(0)}
          className="mt-4 px-6 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
    </main>
  );
}
