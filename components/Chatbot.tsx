"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Moon, Sun, Send, Paperclip, X, Trash2 } from "lucide-react"; // Added Trash2 icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import "highlight.js/styles/github-dark.css";

interface ChatEntry {
  question: string;
  answer: string;
}

export default function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    }

    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else if (prefersDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() && !file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", question);
      if (file) {
        formData.append("file", file);
      }

      const tempEntry: ChatEntry = {
        question: question || `[File: ${file?.name}]`,
        answer:
          "Loading... Please wait for a few minutes while we process your request.",
      };
      setChatHistory([...chatHistory, tempEntry]);

      const res = await fetch("/api/chatbot", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const newEntry: ChatEntry = {
        question: question || `[File: ${file?.name}]`,
        answer: data.answer,
      };
      const updatedChatHistory = [...chatHistory.slice(0, -1), newEntry];

      setChatHistory(updatedChatHistory);
      localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
      setQuestion("");
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
      setChatHistory(chatHistory.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(uploadedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  // Function to delete a chat entry
  const deleteChatEntry = (index: number) => {
    const updatedChatHistory = chatHistory.filter((_, i) => i !== index);
    setChatHistory(updatedChatHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
  };

  return (
    <TooltipProvider>
      <div className={`flex flex-col h-screen ${isDarkMode ? "dark" : ""}`}>
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center p-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Gemini
              </h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {isDarkMode ? (
                      <Sun className="h-[1.4rem] w-[1.2rem]" />
                    ) : (
                      <Moon className="h-[1.4rem] w-[1.2rem]" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isDarkMode ? "Light mode" : "Dark mode"}
                </TooltipContent>
              </Tooltip>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 pb-4"
            >
              {chatHistory.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-2xl text-gray-500 dark:text-gray-400">
                    Hello, User
                  </p>
                </div>
              )}
              {chatHistory.map((entry, index) => (
                <div key={index} className="mb-6 flex justify-between">
                  <div>
                    <div className="flex items-start space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">
                        U
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {entry.question}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-green-300 flex items-center justify-center text-white font-bold">
                        G
                      </div>
                      <div className="flex-1">
                        {entry.answer ===
                        "Loading... Please wait for a few minutes while we process your request." ? (
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                          </div>
                        ) : (
                          <ReactMarkdown
                            className="prose dark:prose-invert max-w-none text-md text-gray-700 dark:text-gray-300"
                            rehypePlugins={[rehypeHighlight]}
                          >
                            {entry.answer}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteChatEntry(index)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              {file && (
                <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md">
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {file.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*,.pdf,.txt"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>Upload file</TooltipContent>
                </Tooltip>
                <Input
                  type="text"
                  placeholder="Type your question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1"
                  disabled={loading}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {loading ? "..." : <Send className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send</TooltipContent>
                </Tooltip>
              </div>
            </form>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
