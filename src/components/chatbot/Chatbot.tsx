"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { X, Send, Bot, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useChatbot } from '../../contexts/ChatbotContext';
import ContactForm, { ContactFormData } from './ContactForm';
import { contactService } from '../../lib/contactService';
import { ChatMessageSkeleton } from '../ui/loading-skeletons';
import {
  buildChatbotContactReplyBody,
  CHATBOT_BRAND_NAME,
  formatChatbotApprovedCategoriesList,
  chatbotAssessmentContactIntent,
  chatbotGettingStartedContactIntent,
  chatbotPricingContactIntent,
  chatbotSchedulingContactIntent,
} from '@/lib/chatbotScope';

/** SSOT: default offset (px) and storage key for floating chat position. */
const FLOATING_CHAT_CONFIG = {
  defaultBottom: 24,
  defaultRight: 24,
  buttonSizePx: 64,
  storageKey: 'growwise_chat_floating_position',
} as const;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showContactForm?: boolean;
}

type FloatingPosition = { left: number; bottom: number };

function loadStoredPosition(): FloatingPosition | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(FLOATING_CHAT_CONFIG.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const left = parsed.left;
    const bottom = parsed.bottom;
    if (typeof left !== 'number' || typeof bottom !== 'number') return null;
    return { left, bottom };
  } catch {
    return null;
  }
}

function clampPosition(pos: FloatingPosition): FloatingPosition {
  const { buttonSizePx } = FLOATING_CHAT_CONFIG;
  const maxLeft = typeof window !== 'undefined' ? window.innerWidth - buttonSizePx : 0;
  const maxBottom = typeof window !== 'undefined' ? window.innerHeight - buttonSizePx : 0;
  return {
    left: Math.max(0, Math.min(pos.left, maxLeft)),
    bottom: Math.max(0, Math.min(pos.bottom, maxBottom)),
  };
}

export default function Chatbot() {
  const t = useTranslations();
  const { isOpen, openChatbot, closeChatbot } = useChatbot();
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      text: t('chatbot.responses.welcome', {
        categories: formatChatbotApprovedCategoriesList(),
      }),
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactFieldErrors, setContactFieldErrors] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [floatPosition, setFloatPosition] = useState<FloatingPosition | null>(null);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const floatButtonWrapRef = useRef<HTMLDivElement>(null);
  const openChatbotRef = useRef(openChatbot);
  openChatbotRef.current = openChatbot;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const stored = loadStoredPosition();
    if (stored) {
      setFloatPosition(clampPosition(stored));
      return;
    }
    const { defaultRight, defaultBottom, buttonSizePx } = FLOATING_CHAT_CONFIG;
    setFloatPosition({
      left: window.innerWidth - defaultRight - buttonSizePx,
      bottom: defaultBottom,
    });
  }, []);

  useEffect(() => {
    if (!floatPosition || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        FLOATING_CHAT_CONFIG.storageKey,
        JSON.stringify(floatPosition)
      );
    } catch {
      /* ignore */
    }
  }, [floatPosition]);

  useEffect(() => {
    if (!floatPosition) return;
    const onResize = () => setFloatPosition((prev) => (prev ? clampPosition(prev) : prev));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [floatPosition]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      didDragRef.current = false;
      isDraggingRef.current = true;
      const pos = floatPosition ?? {
        left: window.innerWidth - FLOATING_CHAT_CONFIG.defaultRight - FLOATING_CHAT_CONFIG.buttonSizePx,
        bottom: FLOATING_CHAT_CONFIG.defaultBottom,
      };
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        left: pos.left,
        bottom: pos.bottom,
      };
      floatButtonWrapRef.current?.setPointerCapture(e.pointerId);
    },
    [floatPosition]
  );

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      didDragRef.current = true;
      const { x, y, left, bottom } = dragStartRef.current;
      const next = clampPosition({
        left: left + (e.clientX - x),
        bottom: bottom - (e.clientY - y),
      });
      setFloatPosition(next);
    };
    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      const wasDrag = didDragRef.current;
      isDraggingRef.current = false;
      if (!wasDrag) openChatbotRef.current();
    };
    const capture = true;
    window.addEventListener('pointermove', onPointerMove, capture);
    window.addEventListener('pointerup', onPointerUp, capture);
    window.addEventListener('pointercancel', onPointerUp, capture);
    return () => {
      window.removeEventListener('pointermove', onPointerMove, capture);
      window.removeEventListener('pointerup', onPointerUp, capture);
      window.removeEventListener('pointercancel', onPointerUp, capture);
    };
  }, []);

  const handleStartChat = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    openChatbot();
  };

  const handleCloseChat = () => {
    closeChatbot();
  };

  const handleContactFormSubmit = async (data: ContactFormData) => {
    setIsSubmittingContact(true);
    setContactError('');
    setContactFieldErrors({});

    try {
      const result = await contactService.submitContactForm(data);

      if (result.success) {
        const successMessage: Message = {
          id: Date.now().toString(),
          text: `Thank you, ${data.name}! We've received your information and will contact you within 24 hours with personalized details about our programs. 📧`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        setMessages(prev => prev.map(msg =>
          msg.id === prev[prev.length - 1].id
            ? { ...msg, showContactForm: false }
            : msg
        ));
      } else {
        setContactError(result.error || result.message || t('contact.form.submitErrorFallback'));
        if (result.errors?.length) {
          setContactFieldErrors(
            result.errors.reduce<Record<string, string>>((acc, { field, message }) => {
              acc[field] = message;
              return acc;
            }, {})
          );
        }
      }
    } catch {
      setContactError(t('contact.form.submitErrorUnexpected'));
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleContactFormCancel = () => {
    // Remove the contact form from the last message
    setMessages(prev => prev.map(msg => 
      msg.id === prev[prev.length - 1].id 
        ? { ...msg, showContactForm: false }
        : msg
    ));
    setContactError('');
    setContactFieldErrors({});
  };


  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    setIsError(false);
    setErrorMessage('');

    // First check if this should trigger a contact form
    const botResponse = getBotResponse(currentInput);
    
    if (botResponse.showContactForm) {
      // Use rule-based response with contact form
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        showContactForm: true
      };
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      return;
    }

    // Otherwise, try LLM API
    try {
      // Prepare conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const llmResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, llmResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsError(true);
      setErrorMessage('Failed to connect to AI service. Using fallback response.');
      
      // Fallback to rule-based response
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        showContactForm: botResponse.showContactForm
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBotResponse = (userInput: string): { text: string; showContactForm?: boolean } => {
    const input = userInput.toLowerCase();
    const scopeLine = `Approved program areas at ${CHATBOT_BRAND_NAME}: ${formatChatbotApprovedCategoriesList()}.`;

    // Greeting responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return {
        text: `Hello! Welcome to ${CHATBOT_BRAND_NAME}! 🎓 ${scopeLine} I'm here to help you learn how we support Tri-Valley families and what might fit your child. What would you like to know?`,
      };
    }

    // K-12 Academic Programs
    if (input.includes('k-12') || input.includes('academic') || input.includes('math') || input.includes('english') || input.includes('ela') || input.includes('writing') || input.includes('sat') || input.includes('act')) {
      return {
        text: `${scopeLine}\n\n📚 **Tutoring & Accelerated Math**: Elementary through high school math, including accelerated tracks and calculus readiness\n\n📖 **English and Writing**: Reading enrichment, grammar, essay writing, and reflective writing workshops\n\n🎯 **Test readiness**: SAT/ACT-focused math and verbal support\n\nWe combine tutoring, workshops, and camps where it fits your goals. Would you like details about any specific focus?`,
      };
    }

    // STEM / STEAM-style Programs (aligned to approved scope labels)
    if (
      input.includes('steam') ||
      input.includes('stem') ||
      input.includes('coding') ||
      input.includes('python') ||
      input.includes('game') ||
      input.includes('roblox') ||
      input.includes('scratch') ||
      input.includes('ai') ||
      input.includes('ml') ||
      input.includes('robot') ||
      input.includes('workshop') ||
      input.includes('entrepreneur')
    ) {
      return {
        text: `${scopeLine}\n\n🎮 **Coding & game building**: Scratch, Roblox Studio, and Python paths\n\n🤖 **AI & STEM enrichment**: Introductory AI/ML explorations and project-based labs\n\n🔧 **Robotics & workshops**: Seasonal intensives and hands-on builds\n\nPrograms are hands-on and designed for Tri-Valley learners. Which area sounds like the best fit?`,
      };
    }

    // Popular Courses
    if (input.includes('popular') || input.includes('course') || input.includes('program')) {
      return {
        text: `${scopeLine}\n\nFamilies often start with **tutoring**, **Accelerated Math**, **English and Writing**, or **Coding / AI** tracks—and we run **workshops** and **camps** throughout the year. Tell me your child's grade or interests and I can narrow it down.`,
      };
    }

    // Assessment and Trial Information
    if (chatbotAssessmentContactIntent(userInput)) {
      return {
        text: `We offer FREE assessments and trial experiences for many tracks:\n\n🎓 **Tutoring & academics**: a structured assessment to place the right plan\n\n🚀 **STEM / coding / workshops**: shorter trial-style sessions where offered\n\n${scopeLine} To schedule the right next step, I'll need a few contact details.`,
        showContactForm: true,
      };
    }

    // Statistics and Trust
    if (input.includes('statistics') || input.includes('students') || input.includes('families') || input.includes('satisfaction') || input.includes('enrolled')) {
      return {
        text: `${CHATBOT_BRAND_NAME} is trusted by Tri-Valley families:\n\n👥 **325+ students** learning with us\n📚 **25+ course paths** across tutoring, STEM, and camps\n👍 **98% parent satisfaction** in recent surveys\n\nWe pair structured tutoring with modern STEM, AI, and robotics experiences.`,
      };
    }

    // Why Choose Us
    if (input.includes('why') || input.includes('choose') || input.includes('benefit') || input.includes('advantage')) {
      return {
        text: `Why families choose ${CHATBOT_BRAND_NAME}:\n\n👨‍🏫 **Expert instructors** with deep K-12 and STEM backgrounds\n\n📈 **Measurable growth** for most learners within the first semester\n\n📋 **Curriculum aligned** to California learning expectations\n\n🔬 **Hands-on STEM, coding, AI, and robotics** alongside tutoring and writing support\n\n${scopeLine}`,
      };
    }

    // Pricing
    if (chatbotPricingContactIntent(userInput)) {
      return {
        text: `We offer fair, program-specific pricing across tutoring, accelerated courses, workshops, and camps. The fastest way to get accurate numbers is a quick consult after a free assessment. ${scopeLine} Share your contact information and our team will follow up with options tailored to your goals.`,
        showContactForm: true,
      };
    }

    // Scheduling and Booking
    if (chatbotSchedulingContactIntent(userInput)) {
      return {
        text: `I'd be happy to help you schedule an assessment, workshop, or camp consultation. ${scopeLine} Leave your contact information and we'll coordinate timing and next steps.`,
        showContactForm: true,
      };
    }

    // Contact Information
    if (input.includes('contact') || input.includes('phone') || input.includes('email') || input.includes('address') || input.includes('location')) {
      return { text: buildChatbotContactReplyBody() };
    }
    
    // Testimonials
    if (input.includes('testimonial') || input.includes('review') || input.includes('feedback') || input.includes('parent') || input.includes('student')) {
      return { text: "Here's what families have shared on Google (5★):\n\n**Parent**: tutoring experience — patience, confidence, and tailored pacing.\n\n**Roger Jiang**: positive half-day Python camp (Levels 1–2), small classes, Hangman project, helpful feedback.\n\n**Parent**: Roblox/coding intro — engaging classes and motivated students.\n\nWe’re grateful for this feedback!" };
    }
    
    // Age/Grade Information
    if (input.includes('age') || input.includes('grade') || input.includes('elementary') || input.includes('middle') || input.includes('high school')) {
      return { text: "We serve students across all grade levels:\n\n🏫 **Elementary**: Basic arithmetic, reading enrichment, creative writing\n\n🏫 **Middle School**: Algebra foundations, grammar boost, essay writing\n\n🏫 **High School**: Advanced math, SAT/ACT prep, ML/AI programs\n\nOur programs are designed to meet students where they are and help them excel at every level. What grade is your child in?" };
    }
    
    // Learning Style
    if (input.includes('learning') || input.includes('style') || input.includes('personalized') || input.includes('individual') || input.includes('group')) {
      return { text: "We offer flexible learning options:\n\n👤 **1:1 Personal Attention**: Specially designed for homework help and targeted learning\n\n👥 **Small Group Learning**: Personalized instruction in small groups\n\n🎯 **Project-Based Learning**: Hands-on STEAM courses with real-world applications\n\nOur expert instructors adapt to your child's learning style and pace. We believe every child learns differently!" };
    }
    
    // Interest in getting started
    if (chatbotGettingStartedContactIntent(userInput)) {
      return {
        text: `That's wonderful! I'd love to help you get started with ${CHATBOT_BRAND_NAME}. ${scopeLine} To personalize a plan, I'll need a few contact details.`,
        showContactForm: true,
      };
    }

    // Default response
    return {
      text: `That's a great question! ${CHATBOT_BRAND_NAME} offers tutoring, accelerated math, English and writing, STEM enrichment, coding, AI, robotics, workshops, and camps. What grade is your child in, or which topic should we explore first?`,
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button — draggable; position persisted */}
      {!isOpen && (
        <div
          ref={floatButtonWrapRef}
          className="fixed z-50 cursor-grab active:cursor-grabbing touch-none"
          style={
            floatPosition
              ? { left: floatPosition.left, bottom: floatPosition.bottom }
              : { right: FLOATING_CHAT_CONFIG.defaultRight, bottom: FLOATING_CHAT_CONFIG.defaultBottom }
          }
          onPointerDown={handlePointerDown}
        >
          <Button
            onClick={handleStartChat}
            aria-label={t('chatbot.openChat')}
            className="h-12 rounded-full border-0 bg-gradient-to-br from-[#1F396D] to-[#29335C] px-4 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl focus-visible:ring-2 focus-visible:ring-[#F16112] focus-visible:ring-offset-2 flex items-center gap-2"
          >
            <Bot className="h-5 w-5 text-white shrink-0" aria-hidden />
            <span className="text-white text-sm font-semibold">{t('chatbot.title')}</span>
          </Button>
        </div>
      )}

      {/* Chat Window — anchored bottom-right so it stays on-screen */}
      {isOpen && (
        <div
          className="fixed z-50 w-[min(420px,calc(100vw-2rem))] h-[min(600px,calc(100vh-6rem))]"
          style={{ right: FLOATING_CHAT_CONFIG.defaultRight, bottom: FLOATING_CHAT_CONFIG.defaultBottom }}
        >
          <Card className="bg-white/95 backdrop-blur-3xl rounded-2xl shadow-2xl border-2 border-white/50 ring-1 ring-white/30 h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t('chatbot.title')}</h3>
                  <p className="text-sm text-white/80">
                    {isError ? t('chatbot.status.fallback') : t('chatbot.status.online')}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCloseChat}
                variant="ghost"
                size="sm"
                aria-label={t('chatbot.closeChat')}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
              >
                <X className="w-5 h-5" aria-hidden />
              </Button>
            </div>

            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px]">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === 'bot' && (
                          <Bot className="w-4 h-4 mt-1 text-[#1F396D] flex-shrink-0" />
                        )}
                        {message.sender === 'user' && (
                          <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Form - appears below the message */}
                  {message.sender === 'bot' && message.showContactForm && (
                    <div className="w-full">
                      <ContactForm
                        onSubmit={handleContactFormSubmit}
                        onCancel={handleContactFormCancel}
                        isLoading={isSubmittingContact}
                        error={contactError}
                        fieldErrors={contactFieldErrors}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <ChatMessageSkeleton />
              )}
              
              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 text-center">Try asking:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      t('chatbot.suggestions.k12Programs'),
                      t('chatbot.suggestions.steamCourses'),
                      t('chatbot.suggestions.bookAssessment'),
                      t('chatbot.suggestions.pricing'),
                      t('chatbot.suggestions.getStarted')
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(suggestion)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-2xl p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#1F396D]" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
              
              {/* Error Message */}
              {isError && errorMessage && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mx-4 mb-2">
                  <p className="text-xs text-yellow-800">{errorMessage}</p>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.slice(0, 600))}
                  onKeyPress={handleKeyPress}
                  maxLength={600}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F16112] focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  aria-label={t('chatbot.sendMessage')}
                  className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white rounded-full w-10 h-10 p-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" aria-hidden />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
