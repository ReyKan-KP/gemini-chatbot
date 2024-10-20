
# Gemini AI Chatbot with Next.js

A simple chatbot built using **Next.js** and **TypeScript**, powered by **Google's Gemini API**. This chatbot allows users to ask questions and receive AI-generated responses, with features like Markdown rendering, syntax highlighting, chat history persistence, and a dark/light theme switch.

## Features

- **AI-Powered Answers**: Utilizes the Gemini API for generating conversational responses.
- **Markdown Support**: Renders responses with rich Markdown, including headings, lists, and code blocks.
- **Syntax Highlighting**: Code blocks in responses are highlighted using `rehype-highlight`.
- **Persistent Chat History**: Previous questions and answers are stored locally in `localStorage`.
- **Dark/Light Theme**: User can toggle between dark and light themes for better accessibility.
- **Responsive Design**: Built with **Tailwind CSS** for a clean and responsive UI on both desktop and mobile.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/ReyKan-KP/gemini-chatbot.git
   ```

2. Navigate to the project folder:

   ```bash
   cd gemini-chatbot
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Set up your **Gemini API** key:

   - Get your API key from [Google AI Studio](https://studio.ai.google.com/).
   - Create a `.env.local` file in the root directory and add your API key:

     ```env
     API_KEY=your-api-key
     ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the chatbot.

## Usage

- Type a question in the input box and press "Ask".
- The AI will respond to your question, and the answer will be displayed in a Markdown format.
- Code snippets in the response will be syntax-highlighted.
- Previous questions and answers are stored in local storage and will persist even after refreshing the page.
- Use the button at the top-right to toggle between dark and light themes.

## Technologies Used

- **Next.js** (with App Router)
- **TypeScript**
- **Tailwind CSS** for styling
- **Google Gemini API** for AI responses
- **ReactMarkdown** and **rehype-highlight** for Markdown rendering and syntax highlighting
- **localStorage** for chat history persistence


