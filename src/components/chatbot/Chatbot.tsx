"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useChatbot } from '../../contexts/ChatbotContext';
import ContactForm, { ContactFormData } from './ContactForm';
import { contactService } from '../../lib/contactService';
import { ChatMessageSkeleton } from '../ui/loading-skeletons';
import { CONTACT_INFO } from '@/lib/constants';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showContactForm?: boolean;
}

export default function Chatbot() {
  const t = useTranslations();
  const { isOpen, openChatbot, closeChatbot } = useChatbot();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chatbot.responses.welcome'),
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactError, setContactError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartChat = () => {
    openChatbot();
  };

  const handleCloseChat = () => {
    closeChatbot();
  };

  const handleContactFormSubmit = async (data: ContactFormData) => {
    setIsSubmittingContact(true);
    setContactError('');

    try {
      const result = await contactService.submitContactForm(data);
      
      if (result.success) {
        // Add success message
        const successMessage: Message = {
          id: Date.now().toString(),
          text: `Thank you, ${data.name}! We've received your information and will contact you within 24 hours with personalized details about our programs. 📧`,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, successMessage]);
        
        // Remove the contact form from the last message
        setMessages(prev => prev.map(msg => 
          msg.id === prev[prev.length - 1].id 
            ? { ...msg, showContactForm: false }
            : msg
        ));
      } else {
        setContactError(result.error || 'Failed to submit contact information');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setContactError('Failed to submit contact information. Please try again.');
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
    
    // Greeting responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return { text: "Hello! Welcome to GrowWise! 🎓 We're a leading educational platform serving Tri-Valley families with comprehensive K-12 academic programs and exciting STEAM courses. I'm here to help you learn about our programs, courses, and how we can support your child's learning journey. What would you like to know?" };
    }
    
    // K-12 Academic Programs
    if (input.includes('k-12') || input.includes('academic') || input.includes('math') || input.includes('english') || input.includes('ela') || input.includes('writing') || input.includes('sat') || input.includes('act')) {
      return { text: "Our K-12 Academic Programs include:\n\n📚 **Math Courses**: Elementary Math, Middle School Math, DUSD Accelerated Math, and High School Math (including Calculus)\n\n📖 **ELA Courses**: English Mastery K-12, Reading Enrichment, and Grammar Boost\n\n✏️ **Writing Lab**: Creative Writing, Essay Writing, and Create & Reflect programs\n\n🎯 **SAT/ACT Prep**: Math Test Prep, Online SAT Test Prep, and Online ACT Test Prep\n\nWe offer personalized 1:1 attention and small group learning. Would you like details about any specific program?" };
    }
    
    // STEAM Programs
    if (input.includes('steam') || input.includes('coding') || input.includes('python') || input.includes('game') || input.includes('roblox') || input.includes('scratch') || input.includes('ai') || input.includes('ml') || input.includes('entrepreneur')) {
      return { text: "Our STEAM Programs include:\n\n🎮 **Game Development**: Roblox Studio, Scratch visual programming, and Minecraft coding\n\n🐍 **Python Programming**: Python Kickstart (beginner), Python Power Up (intermediate), and Python Pro (advanced)\n\n💡 **Young Founders**: Youth CEO leadership program and I Am Brand personal branding\n\n🤖 **ML/Gen AI**: Prompt Engineering, AI for Everyone, and ML/AI for Highschoolers\n\nAll programs are hands-on and project-based. Which STEAM program interests you most?" };
    }
    
    // Popular Courses
    if (input.includes('popular') || input.includes('course') || input.includes('program')) {
      return { text: "Our most popular courses are:\n\n🐍 **Python Coding** - Project-based learning\n🧮 **Math Mastery** - 1:1 attention\n🤖 **AI Explorer** - Future-ready skills\n📚 **Reading Mastery** - Accelerated growth\n\nWe also offer comprehensive K-12 academic programs and exciting STEAM courses. Would you like to know more about any specific course or program?" };
    }
    
    // Assessment and Trial Information
    if (input.includes('assessment') || input.includes('trial') || input.includes('demo') || input.includes('free') || input.includes('evaluate') || input.includes('test')) {
      return { 
        text: "We offer FREE assessments and trial classes:\n\n🎓 **K-12 Programs**: 60-minute FREE assessment to evaluate your child's needs\n\n🚀 **STEAM Courses**: 30-minute trial class to experience our hands-on learning\n\nThese help us create a personalized learning plan for your child. To get started, I'll need some contact information to schedule your free assessment or trial class.",
        showContactForm: true
      };
    }
    
    // Statistics and Trust
    if (input.includes('statistics') || input.includes('students') || input.includes('families') || input.includes('satisfaction') || input.includes('enrolled')) {
      return { text: "GrowWise is trusted by Tri-Valley families:\n\n👥 **325+ Students Enrolled**\n📚 **25+ Courses Offered**\n👍 **98% Student Satisfaction**\n\nWe're proud to serve the Tri-Valley community with proven results and expert instruction. Our students show measurable improvement within the first semester!" };
    }
    
    // Why Choose Us
    if (input.includes('why') || input.includes('choose') || input.includes('benefit') || input.includes('advantage')) {
      return { text: "Why choose GrowWise?\n\n👨‍🏫 **Expert Instructors**: Certified teachers with years of K-12 and STEAM experience\n\n📈 **Proven Results**: 95% of students show measurable improvement in the first semester\n\n📋 **Comprehensive Curriculum**: Aligned with state standards and modern learning needs\n\n🔬 **Hands-on Learning**: Interactive labs and projects that make learning engaging\n\nWe provide personalized attention and innovative teaching methods that make us stand out!" };
    }
    
    // Pricing
    if (input.includes('price') || input.includes('cost') || input.includes('fee') || input.includes('payment')) {
      return { 
        text: "We offer competitive pricing for all our programs. For the most accurate pricing information, I'd recommend booking a free assessment where our team can provide detailed information based on your specific needs and program selection. To get personalized pricing, I'll need some contact information to schedule your free assessment.",
        showContactForm: true
      };
    }
    
    // Scheduling and Booking
    if (input.includes('schedule') || input.includes('book') || input.includes('appointment') || input.includes('register') || input.includes('enroll')) {
      return { 
        text: "I'd be happy to help you schedule an assessment or trial class! To get started, I'll need some contact information to book your appointment and send you personalized details about our programs.",
        showContactForm: true
      };
    }
    
    // Contact Information
    if (input.includes('contact') || input.includes('phone') || input.includes('email') || input.includes('address') || input.includes('location')) {
      return { text: `You can reach us at:\n\n📞 Phone: ${CONTACT_INFO.phone}\n📧 Email: ${CONTACT_INFO.email}\n📍 Address: ${CONTACT_INFO.address}\n\nWe're here to answer any questions about our programs and help you get started on your learning journey! Our team is responsive and will get back to you within 24 hours.` };
    }
    
    // Testimonials
    if (input.includes('testimonial') || input.includes('review') || input.includes('feedback') || input.includes('parent') || input.includes('student')) {
      return { text: "Here's what our families say:\n\n👩‍👧 **Sarah Johnson (Parent)**: 'GrowWise transformed my daughter's approach to learning. She went from struggling with math to excelling in advanced courses.'\n\n👨‍🎓 **Michael Chen (Student)**: 'The STEAM programs opened up a whole new world. I'm now pursuing computer science in college!'\n\n👩‍👦 **Lisa Rodriguez (Parent)**: 'The personalized attention and innovative teaching methods make GrowWise stand out.'\n\nAll our families give us 5-star ratings!" };
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
    if (input.includes('start') || input.includes('begin') || input.includes('join') || input.includes('sign up') || input.includes('get started') || input.includes('interested')) {
      return { 
        text: "That's wonderful! I'd love to help you get started with GrowWise. To provide you with the most personalized information about our programs and create a learning plan for your child, I'll need some contact information.",
        showContactForm: true
      };
    }

    // Default response
    return { text: "That's a great question! I'd be happy to help you with that. GrowWise offers comprehensive K-12 academic programs and exciting STEAM courses. Could you provide a bit more detail about what specific information you're looking for? I can help with course details, scheduling assessments, pricing, or any other questions about our programs!" };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleStartChat}
            className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20 backdrop-blur-sm flex items-center justify-center p-0 [&_svg]:!size-7"
            size="lg"
          >
            <MessageCircle className="size-7" style={{ width: '28px', height: '28px' }} />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px]">
          <Card className="bg-white/95 backdrop-blur-3xl rounded-2xl shadow-2xl border-2 border-white/50 ring-1 ring-white/30 h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">GrowWise Assistant</h3>
                  <p className="text-sm text-white/80">
                    {isError ? 'Using fallback mode' : 'Online now'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCloseChat}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
              >
                <X className="w-5 h-5" />
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
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F16112] focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white rounded-full w-10 h-10 p-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
