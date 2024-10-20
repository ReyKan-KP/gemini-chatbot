import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

type ChatbotResponse = {
    answer?: string;
    error?: string;
};

export async function POST(req: Request) {
    try {
        const { question } = await req.json();

        // Initialize GoogleGenerativeAI with your API key
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error('API_KEY is not defined in environment variables');
        }
        const genAI = new GoogleGenerativeAI(apiKey);

        // Fetch the model
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });

        // Use the model to generate text
        const result = await model.generateContent(question);

        // Check if result is valid
        if (!result.response || !result.response.text) {
            return NextResponse.json({ error: 'Failed to generate a response' }, { status: 500 });
        }

        // Respond with the generated text
        return NextResponse.json({ answer: result.response.text() } as ChatbotResponse);
    } catch (error) {
        console.error('Error generating content:', error);
        return NextResponse.json({ error: 'Something went wrong' } as ChatbotResponse, {
            status: 500,
        });
    }
}
