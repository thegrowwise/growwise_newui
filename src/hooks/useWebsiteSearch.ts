import { useState, useCallback, useRef } from 'react';
import { websiteSearchService } from '@/lib/websiteSearchService';

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

interface UseWebsiteSearchOptions {
  limit?: number;
  category?: string;
  useLLM?: boolean;
  debounceMs?: number;
}

interface UseWebsiteSearchReturn {
  // Search state
  query: string;
  results: SearchResult[];
  suggestions: string[];
  summary: string;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  
  // Search methods
  search: (query: string) => Promise<void>;
  getSuggestions: (query: string) => Promise<void>;
  clearSearch: () => void;
  setQuery: (query: string) => void;
  
  // Search metadata
  totalResults: number;
  searchTime: number;
  method: 'llm' | 'simple';
}

export function useWebsiteSearch(options: UseWebsiteSearchOptions = {}): UseWebsiteSearchReturn {
  const {
    limit = 10,
    category = null,
    useLLM = true,
    debounceMs = 300
  } = options;

  // State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  const [method, setMethod] = useState<'llm' | 'simple'>('simple');

  // Refs for debouncing
  const debounceRef = useRef<NodeJS.Timeout>();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setSummary('');
    setError(null);
    setTotalResults(0);
    setSearchTime(0);
    setIsLoading(false);
    setIsSearching(false);
    
    // Clear timeouts
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  // Search function
  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      clearSearch();
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response: SearchResponse = await websiteSearchService.search(searchQuery, {
        limit,
        category,
        useLLM
      });

      setResults(response.results);
      setSummary(response.summary);
      setSuggestions(response.suggestions);
      setTotalResults(response.totalResults);
      setSearchTime(response.searchTime);
      setMethod(response.method);

    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setSummary('');
      setSuggestions([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  }, [limit, category, useLLM, clearSearch]);

  // Get suggestions
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const newSuggestions = await websiteSearchService.getSuggestions(searchQuery, 5);
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Suggestions error:', err);
      setSuggestions([]);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      search(searchQuery);
    }, debounceMs);
  }, [search, debounceMs]);

  // Debounced suggestions
  const debouncedSuggestions = useCallback((searchQuery: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      getSuggestions(searchQuery);
    }, debounceMs);
  }, [getSuggestions, debounceMs]);

  // Handle query change
  const handleSetQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    
    if (newQuery.trim().length >= 2) {
      debouncedSearch(newQuery);
      debouncedSuggestions(newQuery);
    } else {
      clearSearch();
    }
  }, [debouncedSearch, debouncedSuggestions, clearSearch]);

  return {
    // State
    query,
    results,
    suggestions,
    summary,
    isLoading,
    isSearching,
    error,
    
    // Methods
    search,
    getSuggestions,
    clearSearch,
    setQuery: handleSetQuery,
    
    // Metadata
    totalResults,
    searchTime,
    method
  };
}

