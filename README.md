

# Gemini AI Chatbot with Next.js

A fully-featured chatbot built using **Next.js** and **TypeScript**, powered by **Google's Gemini API**. This chatbot allows users to ask questions and receive AI-generated responses, with capabilities like Markdown rendering, syntax highlighting, file uploads, chat history management, and a customizable dark/light theme.

## Features

- **AI-Powered Answers**: Utilizes the Gemini API for generating conversational responses.
- **Markdown Support**: Renders responses with rich Markdown, including headings, lists, and code blocks.
- **Syntax Highlighting**: Code blocks in responses are highlighted using `rehype-highlight`.
- **Persistent Chat History**: Previous questions and answers are stored locally in `localStorage`, enabling users to maintain their conversation history even after refreshing the page.
- **Dark/Light Theme Toggle**: Users can easily switch between dark and light modes for a more comfortable viewing experience.
- **File Upload Capability**: Users can upload files (images, PDFs, or text files) to include in their questions.
- **File Management**: Users can view and remove uploaded files before submitting their questions.
- **Chat Message Deletion**: Users can delete individual messages from the chat history.
- **Responsive Design**: Built with **Tailwind CSS** for a seamless experience across all screen sizes, from desktop to mobile.
- **Error Handling & Notifications**: Clear and user-friendly error messages and feedback are provided for file upload issues or AI processing delays.

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

6. Open [http://localhost:3000](http://localhost:3000) in your browser to start interacting with the chatbot.

## Usage

- **Ask Questions**: Type your question or upload a file and press "Send". The AI will process the input and provide a detailed response.
- **View Responses**: Answers are rendered in Markdown format, with syntax highlighting for code snippets.
- **File Upload**: Upload a file (image, PDF, or text) to include in your question. The uploaded file is shown, and you can remove it before submitting the query.
- **Delete Messages**: Click the delete icon next to any message to remove it from your chat history.
- **Theme Toggle**: Use the button at the top-right to toggle between dark and light themes.
- **Persistent Chat**: Your chat history is saved locally and will be restored when you revisit or refresh the page.

## Technologies Used

- **Next.js** (with App Router)
- **TypeScript**
- **Tailwind CSS** for styling
- **Google Gemini API** for AI responses
- **ReactMarkdown** and **rehype-highlight** for Markdown rendering and syntax highlighting
- **localStorage** for chat history persistence
- **Lucide Icons** for interface icons
- **Toast Notifications** for error handling and user feedback

