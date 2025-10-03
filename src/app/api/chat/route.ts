import { NextRequest, NextResponse } from 'next/server';
import { llmService } from '@/lib/llm';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Convert conversation history to the format expected by LLM
    const messages = conversationHistory.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content
    }));

    // Add the current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Generate response using LLM service
    const response = await llmService.generateResponse(messages);

    if (response.error) {
      // If LLM fails, use fallback response
      const fallbackResponse = llmService.getFallbackResponse(message);
      return NextResponse.json({
        message: fallbackResponse,
        isFallback: true,
        error: response.error
      });
    }

    return NextResponse.json({
      message: response.content,
      isFallback: false
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: "I'm experiencing technical difficulties. Please try again or contact GrowWise directly for assistance."
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
