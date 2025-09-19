"use client";
import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface StartChatButtonProps {
  onStartChat: () => void;
  variant?: 'default' | 'hero' | 'floating';
  className?: string;
  children?: React.ReactNode;
}

export default function StartChatButton({ 
  onStartChat, 
  variant = 'default',
  className = '',
  children 
}: StartChatButtonProps) {
  const baseClasses = "transition-all duration-300 transform hover:scale-105";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white rounded-full px-6 py-3 font-semibold shadow-lg hover:shadow-xl",
    hero: "bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl backdrop-blur-sm border border-white/20",
    floating: "bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm"
  };

  const iconSize = variant === 'floating' ? 'w-8 h-8' : 'w-5 h-5';
  const iconMargin = variant === 'floating' ? '' : 'mr-2';

  return (
    <Button
      onClick={onStartChat}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      size={variant === 'floating' ? 'lg' : 'default'}
    >
      {children || (
        <>
          <MessageCircle className={`${iconSize} ${iconMargin}`} />
          {variant !== 'floating' && 'Start Chat'}
        </>
      )}
      {variant === 'hero' && <Sparkles className="ml-2 w-5 h-5" />}
    </Button>
  );
}
