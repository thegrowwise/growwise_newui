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

interface SearchOptions {
  limit?: number;
  category?: string;
  useLLM?: boolean;
}

export class WebsiteSearchService {
  private static instance: WebsiteSearchService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  public static getInstance(): WebsiteSearchService {
    if (!WebsiteSearchService.instance) {
      WebsiteSearchService.instance = new WebsiteSearchService();
    }
    return WebsiteSearchService.instance;
  }

  /**
   * Search website content using LLM
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    try {
      const { limit = 10, category = null, useLLM = true } = options;

      const response = await fetch(`${this.baseUrl}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit,
          category,
          useLLM
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WebsiteSearchService: Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }

      return data.data;

    } catch (error) {
      console.error('WebsiteSearchService Error:', error);
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Suggestions failed');
      }

      return data.data.suggestions || [];

    } catch (error) {
      console.error('WebsiteSearchService Suggestions Error:', error);
      // Return fallback suggestions
      return [
        'Math courses',
        'Python programming',
        'AI Explorer',
        'Free assessment',
        'STEAM courses'
      ];
    }
  }

  /**
   * Get available search categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/search/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Categories failed');
      }

      return data.data.categories || [];

    } catch (error) {
      console.error('WebsiteSearchService Categories Error:', error);
      return ['academic', 'steam', 'about', 'services', 'testimonials'];
    }
  }

  /**
   * Get search statistics
   */
  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/search/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Stats failed');
      }

      return data.data;

    } catch (error) {
      console.error('WebsiteSearchService Stats Error:', error);
      return {
        totalIndexedItems: 0,
        categories: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Add content to search index (for dynamic content)
   */
  async addToIndex(content: {
    title: string;
    content: string;
    category: string;
    url: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/search/index`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;

    } catch (error) {
      console.error('WebsiteSearchService Add Index Error:', error);
      return false;
    }
  }

  /**
   * Update content in search index
   */
  async updateInIndex(id: string, content: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/search/index/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;

    } catch (error) {
      console.error('WebsiteSearchService Update Index Error:', error);
      return false;
    }
  }

  /**
   * Remove content from search index
   */
  async removeFromIndex(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/search/index/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;

    } catch (error) {
      console.error('WebsiteSearchService Remove Index Error:', error);
      return false;
    }
  }
}

export const websiteSearchService = WebsiteSearchService.getInstance();
