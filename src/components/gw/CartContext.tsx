'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  type?: string;
  duration?: string;
  instructor?: string;
  level?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

// localStorage key for cart persistence
const CART_STORAGE_KEY = 'growwise_cart';

// Helper functions for localStorage
const saveCartToStorage = (cartState: CartState) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }
};

const loadCartFromStorage = (): CartState | null => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }
  return null;
};

const clearCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
    }
  }
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        newState = {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      } else {
        const newItems = [...state.items, action.payload];
        newState = {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      }
      break;
    }
    
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      newState = {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      };
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      newState = {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };
      break;
    }
    
    case 'CLEAR_CART':
      newState = {
        items: [],
        total: 0,
        itemCount: 0
      };
      clearCartFromStorage();
      return newState;
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }

  // Save to localStorage after each action (except LOAD_CART and CLEAR_CART)
  if (action.type !== 'LOAD_CART') {
    saveCartToStorage(newState);
  }

  return newState;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always start with empty cart to match server-side render
  // This prevents hydration mismatches
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load cart from localStorage only after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && !isHydrated) {
      const savedCart = loadCartFromStorage();
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: savedCart });
      }
      setIsHydrated(true);
    }
  }, [isHydrated]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
