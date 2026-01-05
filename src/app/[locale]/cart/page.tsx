'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, CheckCircle, X } from "lucide-react";
import { useCart } from '@/components/gw/CartContext';
import ImageWithFallback from '@/components/gw/ImageWithFallback';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const CartPage: React.FC = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const locale = useLocale();
  const createLocaleUrl = (path: string) => `/${locale}${path}`;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#ebebeb]" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      
      {/* Header */}
      <section className="bg-white py-4 sm:py-6 border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
              <Link href={createLocaleUrl('/')}>
                <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Continue Shopping</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#F16112]" />
                <span className="text-sm sm:text-lg font-semibold text-gray-700">
                  {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {state.items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any courses to your cart yet.</p>
            <Link href={createLocaleUrl('/courses/math')}>
              <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-3 rounded-full">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cart Items</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {state.items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        {/* Course Image and Details Row */}
                        <div className="flex items-start gap-3 sm:gap-4 w-full sm:flex-1">
                          {/* Course Image */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-lg flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          
                          {/* Course Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 break-words">{item.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge className="bg-[#F16112]/10 text-[#F16112] border-[#F16112]/20 text-xs">
                                {item.category || 'Course'}
                              </Badge>
                              {item.level && (
                                <Badge variant="outline" className="text-gray-600 text-xs">
                                  {item.level}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 space-y-0.5">
                              {item.duration && <p>Duration: {item.duration}</p>}
                              {item.instructor && <p>Instructor: {item.instructor}</p>}
                            </div>
                          </div>
                        </div>
                        
                        {/* Quantity Controls and Price - Full width on mobile */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full sm:w-auto sm:flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                          <div className="flex items-center justify-between sm:justify-start gap-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Price */}
                          <div className="text-left sm:text-right sm:min-w-[6rem]">
                            <div className="text-lg sm:text-xl font-bold text-[#1F396D]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs sm:text-sm text-gray-500">
                                ${item.price.toFixed(2)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 lg:top-8">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h3>
                  
                  {/* Summary Details */}
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex justify-between text-sm sm:text-base text-gray-600">
                      <span>Subtotal ({state.itemCount} items)</span>
                      <span className="font-medium">${state.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-gray-600">
                      <span>Processing Fee (3.5%)</span>
                      <span className="font-medium">${(state.total * 0.035).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-gray-600">
                      <span>Tax</span>
                      <span className="text-xs sm:text-sm">Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-3 sm:pt-4">
                      <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                        <span>Estimated Total</span>
                        <span>${(state.total * 1.035).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">* Tax calculated at checkout</p>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link href={createLocaleUrl('/checkout')} className="block">
                    <Button className="w-full bg-[#F16112] hover:bg-[#d54f0a] text-white py-3 mb-3 sm:mb-4 text-sm sm:text-base">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-0">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">What's included:</h4>
                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Access to all course materials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Expert instructor support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Progress tracking and reports</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;









