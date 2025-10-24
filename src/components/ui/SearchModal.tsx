"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, BookOpen, Calculator, Brain, Gamepad2, GraduationCap, Target, BookMarked, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface SearchSuggestion {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  category: string;
}

const searchSuggestions: SearchSuggestion[] = [
  // Academic Programs
  {
    id: 'math-courses',
    title: 'Math Courses',
    description: 'Master mathematics from basics to advanced',
    href: '/courses/math',
    icon: Calculator,
    category: 'Academic'
  },
  {
    id: 'english-courses',
    title: 'English Courses',
    description: 'Comprehensive English language arts',
    href: '/courses/english',
    icon: BookOpen,
    category: 'Academic'
  },
  {
    id: 'high-school-math',
    title: 'High School Math',
    description: 'Advanced mathematics for high school students',
    href: '/courses/high-school-math',
    icon: GraduationCap,
    category: 'Academic'
  },
  {
    id: 'sat-prep',
    title: 'SAT Prep',
    description: 'Comprehensive SAT test preparation',
    href: '/courses/sat-prep',
    icon: Target,
    category: 'Academic'
  },
  {
    id: 'book-assessment',
    title: 'Book Assessment',
    description: 'Schedule academic evaluation and get insights',
    href: '/book-assessment',
    icon: BookMarked,
    category: 'Academic'
  },
  {
    id: 'enroll-academic',
    title: 'Enroll Now - Academic',
    description: 'Register for academic programs today',
    href: '/enroll-academic',
    icon: UserCheck,
    category: 'Academic'
  },
  // STEAM Programs
  {
    id: 'ml-ai-coding',
    title: 'ML/AI Coding',
    description: 'Explore artificial intelligence and machine learning',
    href: '/steam/ml-ai-coding',
    icon: Brain,
    category: 'STEAM'
  },
  {
    id: 'game-development',
    title: 'Game Development',
    description: 'Create games with Roblox, Scratch, and Unity',
    href: '/steam/game-development',
    icon: Gamepad2,
    category: 'STEAM'
  },
  // General Pages
  {
    id: 'about',
    title: 'About Us',
    description: 'Learn more about GrowWise',
    href: '/about',
    icon: BookOpen,
    category: 'General'
  },
  {
    id: 'contact',
    title: 'Contact Us',
    description: 'Get in touch with our team',
    href: '/contact',
    icon: BookOpen,
    category: 'General'
  }
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredSuggestions(searchSuggestions.slice(0, 6)); // Show top 6 suggestions
    } else {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Limit to 8 results
    }
    setSelectedIndex(0);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions[selectedIndex]) {
        window.location.href = filteredSuggestions[selectedIndex].href;
      }
    }
  };

  // Close modal when clicking outside and apply body blur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('search-modal-open');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('search-modal-open');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      data-search-modal="true"
    >
      {/* Subtle Backdrop - No Blur */}
      <div className="absolute inset-0 bg-black/30 transition-opacity duration-300" onClick={onClose} />
      
      {/* Enhanced Modal with Focus */}
      <div 
        ref={modalRef}
        className="search-modal relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in-up ring-4 ring-blue-500/20"
        data-search-modal="true"
      >
        {/* Search Input */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search courses, programs, and more..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-4 py-4 text-lg bg-transparent border-none outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500/30 rounded-lg transition-all duration-200"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="max-h-96 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            <div className="p-2">
              {filteredSuggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                const isSelected = index === selectedIndex;
                
                return (
                  <Link
                    key={suggestion.id}
                    href={suggestion.href}
                    onClick={onClose}
                    className={`flex items-center p-4 rounded-xl transition-all duration-200 group ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#1F396D]/10 to-[#F16112]/10 border border-[#1F396D]/20' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                      suggestion.category === 'Academic' 
                        ? 'bg-[#1F396D]/10 text-[#1F396D]' 
                        : suggestion.category === 'STEAM'
                        ? 'bg-[#F16112]/10 text-[#F16112]'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {suggestion.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          suggestion.category === 'Academic' 
                            ? 'bg-[#1F396D]/10 text-[#1F396D]' 
                            : suggestion.category === 'STEAM'
                            ? 'bg-[#F16112]/10 text-[#F16112]'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {suggestion.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {suggestion.description}
                      </p>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try searching for courses, programs, or general topics</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 bg-gray-50/50 rounded-b-2xl">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <span>{filteredSuggestions.length} results</span>
          </div>
        </div>
      </div>
    </div>
  );
}
