'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Badge } from './badge';
import { X, ShoppingCart, Plus, Check } from 'lucide-react';
import { Gamepad2, Code, Blocks } from 'lucide-react';
import { useCart } from '@/components/gw/CartContext';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface Workshop {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  level: string;
  gradient: string;
  bgColor: string;
  price?: number;
}

interface DateSlot {
  date: string;
  day: string;
  time: string;
  duration: string;
}

interface WinterCampCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshops: Workshop[];
  onSelectSlot?: (workshopId: string, dateSlot: DateSlot) => void;
  scrollToWorkshopId?: string | null;
}

const WinterCampCalendarModal: React.FC<WinterCampCalendarModalProps> = ({
  isOpen,
  onClose,
  workshops,
  onSelectSlot,
  scrollToWorkshopId
}) => {
  const { addItem, state: cartState } = useCart();
  const locale = useLocale();
  const workshopRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const createLocaleUrl = (path: string) => `/${locale}${path}`;

  // Scroll to specific camp when modal opens
  useEffect(() => {
    if (isOpen && scrollToWorkshopId) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        const element = workshopRefs.current[scrollToWorkshopId];
        if (element) {
          const scrollContainer = element.closest('[class*="overflow-y-auto"]') as HTMLElement;
          if (scrollContainer) {
            const elementTop = element.offsetTop;
            const headerOffset = 120; // Account for sticky header
            scrollContainer.scrollTo({
              top: elementTop - headerOffset,
              behavior: 'smooth'
            });
          } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 300);
    }
  }, [isOpen, scrollToWorkshopId]);
  // Date ranges from Dec 22nd to Jan 2nd
  const dateRanges = [
    { label: 'Dec 22-28', dates: ['Dec 22', 'Dec 23', 'Dec 24', 'Dec 25', 'Dec 26', 'Dec 27', 'Dec 28'] },
    { label: 'Dec 29 - Jan 02', dates: ['Dec 29', 'Dec 30', 'Dec 31', 'Jan 01', 'Jan 02'] }
  ];

  // Generate date slots for each range
  const generateDateSlots = (dates: string[]): DateSlot[] => {
    return dates.map((date, index) => {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayIndex = (index + 0) % 7; // Dec 22, 2024 is a Sunday
      return {
        date,
        day: dayNames[dayIndex],
        time: '3 Hours',
        duration: '1-Day Camp'
      };
    });
  };

  const handleSelect = (workshopId: string, dateSlot: DateSlot) => {
    const workshop = workshops.find(w => w.id === workshopId);
    if (!workshop) return;

    // Create unique ID for this cart item
    const cartItemId = `${workshopId}-${dateSlot.date}`;
    
    // Create cart item
    const cartItem = {
      id: cartItemId,
      name: `${workshop.title} - ${dateSlot.date}`,
      price: workshop.price || 75,
      quantity: 1,
      category: 'Winter Camp',
      type: 'Camp',
      duration: dateSlot.time,
      level: workshop.level || ''
    };

    // Add to cart
    addItem(cartItem);
    
    // Mark as added (for visual feedback)
    setAddedItems(prev => new Set(prev).add(cartItemId));
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }, 2000);

    // Call the optional callback
    if (onSelectSlot) {
      onSelectSlot(workshopId, dateSlot);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[98vw] !w-[98vw] max-h-[90vh] overflow-hidden p-0 bg-white sm:!max-w-[98vw]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <DialogHeader className="flex-1">
            <DialogTitle className="text-2xl font-bold">Calendar Week</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <Link
              href={createLocaleUrl('/cart')}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Shopping Cart"
              onClick={onClose}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F16112] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartState.itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Date Range Headers */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300 sticky top-0 z-10 pt-3 shadow-sm">
            <div className="grid grid-cols-[380px_repeat(2,1fr)] gap-8 px-8 py-4">
              <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Camp Details
              </div>
              {dateRanges.map((range, index) => (
                <div key={index} className="text-center font-bold text-gray-900 text-lg flex items-center justify-center gap-2">
                  <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                  {range.label}
                </div>
              ))}
            </div>
          </div>

          {/* Camp Rows */}
          <div className="divide-y divide-gray-300 pt-4">
            {workshops.map((workshop) => {
              const IconComponent = workshop.icon;
              return (
                <div 
                  key={workshop.id} 
                  ref={(el) => {
                    if (el) {
                      workshopRefs.current[workshop.id] = el;
                    }
                  }}
                  className="bg-white hover:bg-gray-50/50 transition-colors scroll-mt-4"
                >
                  <div className="grid grid-cols-[380px_repeat(2,1fr)] gap-8 px-8 py-6 items-start">
                    {/* Left Section - Camp Details */}
                    <div className="flex items-start gap-4 sticky top-[100px]">
                      <div className={`${workshop.bgColor} rounded-xl p-4 flex-shrink-0 shadow-lg`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                          {workshop.title}
                        </h3>
                      </div>
                    </div>

                    {/* Date Columns */}
                    {dateRanges.map((range, rangeIndex) => {
                      const dateSlots = generateDateSlots(range.dates);
                      return (
                        <div key={rangeIndex} className="flex flex-col gap-3 min-w-[200px]">
                          {dateSlots.map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 w-full cursor-pointer group"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-base font-bold text-gray-900">
                                  {slot.date}
                                </div>
                                <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                                  {slot.day}
                                </div>
                              </div>
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  <span className="font-medium">{slot.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                  <span className="font-medium">{slot.time}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                  <span className="text-xs text-gray-600 font-medium">Price:</span>
                                  <span className="text-lg font-bold text-gray-900">${workshop.price || 75}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleSelect(workshop.id, slot)}
                                disabled={addedItems.has(`${workshop.id}-${slot.date}`)}
                                className={`w-full text-sm py-2.5 h-auto font-bold shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105 flex items-center justify-center gap-2 ${
                                  addedItems.has(`${workshop.id}-${slot.date}`)
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed'
                                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900'
                                }`}
                              >
                                {addedItems.has(`${workshop.id}-${slot.date}`) ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Added!
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4" />
                                    Add to Cart
                                  </>
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinterCampCalendarModal;

