"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight, BookOpen, Code, Users, Star } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { websiteSearchService } from '@/lib/websiteSearchService';
import { SearchResultsSkeleton } from '../../ui/loading-skeletons';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  url: string;
  relevanceScore: number;
  matchedTerms: string[];
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  summary: string;
  suggestions: string[];
  totalResults: number;
  searchTime: number;
  method: 'llm' | 'simple';
}

const categoryIcons = {
  academic: BookOpen,
  steam: Code,
  about: Users,
  services: Star,
  testimonials: Star,
  default: Search
};

const categoryColors = {
  academic: 'text-blue-600 bg-blue-50',
  steam: 'text-purple-600 bg-purple-50',
  about: 'text-green-600 bg-green-50',
  services: 'text-orange-600 bg-orange-50',
  testimonials: 'text-yellow-600 bg-yellow-50',
  default: 'text-gray-600 bg-gray-50'
};

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSummary, setSearchSummary] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowSuggestions(false);
        setQuery('');
        setResults([]);
      } else if (event.key === 'Enter' && selectedIndex >= 0) {
        if (showSuggestions && suggestions[selectedIndex]) {
          setQuery(suggestions[selectedIndex]);
          handleSearch(suggestions[selectedIndex]);
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => 
          showSuggestions 
            ? Math.min(prev + 1, suggestions.length - 1)
            : Math.min(prev + 1, results.length - 1)
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showSuggestions, suggestions, results]);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    try {
      const response: SearchResponse = await websiteSearchService.search(searchQuery, {
        limit: 8,
        useLLM: true
      });

      setResults(response.results);
      setSearchSummary(response.summary);
      setSuggestions(response.suggestions);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSearchSummary('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length >= 2) {
      // Show suggestions while typing
      setShowSuggestions(true);
      
      // Debounce search
      debounceRef.current = setTimeout(async () => {
        try {
          const newSuggestions = await websiteSearchService.getSuggestions(value, 5);
          setSuggestions(newSuggestions);
        } catch (error) {
          console.error('Suggestions error:', error);
        }
      }, 300);
    } else {
      setShowSuggestions(false);
      setResults([]);
      setSearchSummary('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the result URL
    window.location.href = result.url;
    setIsOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
      </Button>


      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSearching) {
                    handleSearch();
                  }
                }}
                placeholder="Search courses, programs, or anything..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                autoFocus
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isSearching && (
              <div className="p-4 text-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p>Searching with AI...</p>
              </div>
            )}

            {!isSearching && results.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">{searchSummary}</p>
                  <span className="text-xs text-gray-400">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2">
                  {isLoading ? (
                    <SearchResultsSkeleton />
                  ) : (
                    results.map((result, index) => (
                    <Card
                      key={result.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedIndex === index ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleResultClick(result)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getCategoryColor(result.category)}`}>
                            {getCategoryIcon(result.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {highlightText(result.title, query)}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {highlightText(result.content, query)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(result.category)}`}>
                                {result.category}
                              </span>
                              <span className="text-xs text-gray-400">
                                {Math.round(result.relevanceScore * 100)}% match
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {!isSearching && results.length === 0 && query && (
              <div className="p-4 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No results found for "{query}"</p>
                <p className="text-sm">Try different keywords or browse our courses</p>
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedIndex === index
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!query && !isSearching && (
              <div className="p-4 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Start typing to search our website</p>
                <p className="text-sm">Try: "math courses", "python programming", "free assessment"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
