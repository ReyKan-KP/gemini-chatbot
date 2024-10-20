"use client"
import { useState, useEffect } from "react";

export default function Chatbot() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Theme Toggle Button */}
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleTheme}
          className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full shadow-lg focus:outline-none"
          aria-label="Toggle theme"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
      </div>

      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-100">
          Gemini Chatbot
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ask
          </button>
        </form>

        {/* Loading and Answer */}
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
            Loading...
          </p>
        ) : (
          answer && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-lg font-medium dark:text-gray-200">Answer:</p>
              <p className="mt-2 text-gray-800 dark:text-gray-100">{answer}</p>
            </div>
          )
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Powered by Gemini API
      </footer>
    </div>
  );
}
