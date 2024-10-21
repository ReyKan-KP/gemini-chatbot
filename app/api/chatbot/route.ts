import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const question = formData.get('question') as string;
    const file = formData.get('file') as File | null;

    let content: any[] = [{ type: 'text', text: question }];

    if (file) {
      const fileBuffer = await file.arrayBuffer();
      content.push({
        type: 'file',
        data: Buffer.from(fileBuffer),
        mimeType: file.type,
      });
    }

    const { text } = await generateText({
      model: googleAI('gemini-1.5-pro-latest'),
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
    });

    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}