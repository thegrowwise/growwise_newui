"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MessageCircle, Users, BookOpen, Code, Award } from 'lucide-react';
import StartChatButton from './StartChatButton';

interface ChatbotDemoProps {
  onStartChat: () => void;
}

export default function ChatbotDemo({ onStartChat }: ChatbotDemoProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const quickQuestions = [
    {
      id: 'k12',
      icon: BookOpen,
      title: 'K-12 Programs',
      question: 'What K-12 academic programs do you offer?',
      color: 'from-[#1F396D] to-[#29335C]'
    },
    {
      id: 'steam',
      icon: Code,
      title: 'STEAM Courses',
      question: 'Tell me about your STEAM programs',
      color: 'from-[#F16112] to-[#F1894F]'
    },
    {
      id: 'assessment',
      icon: Award,
      title: 'Free Assessment',
      question: 'How do I book a free assessment?',
      color: 'from-[#F1894F] to-[#F16112]'
    },
    {
      id: 'pricing',
      icon: Users,
      title: 'Pricing Info',
      question: 'What are your program prices?',
      color: 'from-[#29335C] to-[#1F396D]'
    }
  ];

  const handleQuickQuestion = (question: string) => {
    onStartChat();
    // In a real implementation, you would pass this question to the chatbot
    console.log('Quick question:', question);
  };

  return (
    <Card className="bg-white/40 backdrop-blur-3xl rounded-2xl shadow-xl border-2 border-white/50 ring-1 ring-white/30">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600">Our AI assistant is here to help you find the information you need</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {quickQuestions.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.id}
                onClick={() => handleQuickQuestion(item.question)}
                className={`bg-gradient-to-r ${item.color} hover:shadow-lg text-white rounded-xl p-4 h-auto flex flex-col items-center gap-2 transition-all duration-300 transform hover:scale-105`}
                variant="ghost"
              >
                <IconComponent className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs opacity-90">{item.question}</p>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="text-center">
          <StartChatButton 
            onStartChat={onStartChat}
            variant="default"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
