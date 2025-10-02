'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, CheckCircle, X } from "lucide-react";
import { useCart } from '@/components/gw/CartContext';
import ImageWithFallback from '@/components/gw/ImageWithFallback';
import Link from 'next/link';

const CartPage: React.FC = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();

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
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#F16112]" />
              <span className="text-lg font-semibold text-gray-700">
                {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {state.items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any courses to your cart yet.</p>
            <Link href="/courses/math">
              <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-3 rounded-full">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cart Items</h2>
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
              
              <div className="space-y-4">
                {state.items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Course Image */}
                        <div className="w-20 h-20 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="w-8 h-8 text-white" />
                        </div>
                        
                        {/* Course Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-[#F16112]/10 text-[#F16112] border-[#F16112]/20">
                              {item.category || 'Course'}
                            </Badge>
                            {item.level && (
                              <Badge variant="outline" className="text-gray-600">
                                {item.level}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.duration && <p>Duration: {item.duration}</p>}
                            {item.instructor && <p>Instructor: {item.instructor}</p>}
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
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
                          
                          {/* Price */}
                          <div className="text-right min-w-[6rem]">
                            <div className="text-lg font-bold text-[#1F396D]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} each
                              </div>
                            )}
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                  
                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({state.itemCount} items)</span>
                      <span>${state.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Processing Fee</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>${state.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <Button className="w-full bg-[#F16112] hover:bg-[#d54f0a] text-white py-3 mb-4">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                  
                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
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









