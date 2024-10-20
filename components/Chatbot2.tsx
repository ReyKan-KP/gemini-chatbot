"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Choose a highlight.js theme, you can pick any

interface ChatEntry {
  question: string;
  answer: string;
}

export default function Chatbot() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);

  // Load the chat history from localStorage on component mount
  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    }
  }, []);

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

    // Store new chat entry in local state
    const newEntry: ChatEntry = { question, answer: data.answer };
    const updatedChatHistory = [...chatHistory, newEntry];

    // Update local storage and state
    setChatHistory(updatedChatHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));

    // Clear the input field after submitting
    setQuestion("");
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

      <div className="w-[50vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-100">
          Gemini Chatbot
        </h1>

        {/* Form for asking question */}
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

        {/* Display loading state */}
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
            Loading...
          </p>
        )}

        {/* Display the conversation history */}
        <div className="mt-6 space-y-4">
          {chatHistory.map((entry, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                User:{" "}
                <span className="text-gray-900 dark:text-gray-100">
                  {entry.question}
                </span>
              </p>
              {/* Render the answer as Markdown with syntax highlighting */}
              <div className="text-lg text-grey-600 dark:text-grey-400 break-words">
                GPT :
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {entry.answer}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Powered by Gemini API
      </footer>
    </div>
  );
}
