'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Check, ArrowLeft } from 'lucide-react';
import { useCart } from '@/components/gw/CartContext';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { getIconComponent } from '@/lib/iconMap';

interface DateSlot {
  date: string;
  day: string;
  time: string;
  duration: string;
}

interface Workshop {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  level: string;
  gradient: string;
  bgColor: string;
  price?: number;
}

function WinterCampCalendarContent() {
  const { addItem } = useCart();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const workshopRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const createLocaleUrl = (path: string) => `/${locale}${path}`;

  // Get scroll target from URL params
  const scrollToWorkshopId = searchParams.get('workshop');

  // Workshops data
  const workshops: Workshop[] = [
    {
      id: 'roblox-workshop',
      title: 'Roblox Camp',
      icon: getIconComponent('Gamepad2'),
      level: 'Beginner - Intermediate',
      gradient: 'from-sky-400 to-sky-600',
      bgColor: 'bg-sky-500',
      price: 75
    },
    {
      id: 'scratch-workshop',
      title: 'Scratch Camp',
      icon: getIconComponent('Blocks'),
      level: 'Beginner',
      gradient: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500',
      price: 75
    },
    {
      id: 'minecraft-workshop',
      title: 'Minecraft Camp',
      icon: getIconComponent('Code'),
      level: 'Intermediate',
      gradient: 'from-slate-500 to-slate-700',
      bgColor: 'bg-slate-600',
      price: 75
    }
  ];

  // Scroll to specific camp when page loads
  useEffect(() => {
    if (scrollToWorkshopId) {
      setTimeout(() => {
        const element = workshopRefs.current[scrollToWorkshopId];
        if (element) {
          const elementTop = element.offsetTop;
          const headerOffset = 120;
          window.scrollTo({
            top: elementTop - headerOffset,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [scrollToWorkshopId]);

  // Date ranges starting from Dec 22nd (Monday) to Jan 2nd
  const dateRanges = [
    { label: 'Dec 22-26', dates: ['Dec 22', 'Dec 23', 'Dec 24', 'Dec 26'] },
    { label: 'Dec 29 - Jan 02', dates: ['Dec 29', 'Dec 30', 'Dec 31', 'Jan 01', 'Jan 02'] }
  ];

  // Generate date slots for each range, filtering out Saturdays and Sundays
  const generateDateSlots = (dates: string[]): DateSlot[] => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Helper function to parse date string and get day of week
    const getDayOfWeek = (dateStr: string): number => {
      const [monthStr, dayStr] = dateStr.split(' ');
      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const month = monthMap[monthStr];
      const day = parseInt(dayStr, 10);
      const year = month === 11 ? 2025 : 2026; // Dec is 2025, Jan is 2026
      
      const date = new Date(year, month, day);
      return date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    };
    
    return dates
      .map((date) => {
        const dayIndex = getDayOfWeek(date);
        return {
          date,
          day: dayNames[dayIndex],
          dayIndex,
          time: '3 Hours',
          duration: '1-Day Camp'
        };
      })
      .filter((slot) => {
        // Filter out Saturdays (6) and Sundays (0)
        return slot.dayIndex !== 0 && slot.dayIndex !== 6;
      })
      .map(({ dayIndex, ...slot }) => slot); // Remove dayIndex from final result
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
  };

  return (
    <div className="min-h-screen bg-[#ebebeb]" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      {/* Header - Positioned below main site header */}
      <div className="bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky z-40 shadow-lg calendar-page-header">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link href={createLocaleUrl('/camps/winter')}>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2 sm:p-2.5"
              aria-label="Back to Winter Camps"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate ml-2 sm:ml-4">Calendar Week</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Date Range Headers - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:block bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300 rounded-t-lg mb-4 shadow-sm">
          <div className="grid grid-cols-[minmax(200px,1fr)_repeat(2,minmax(150px,1fr))] gap-4 lg:gap-8 px-4 lg:px-8 py-3 lg:py-4">
            <div className="font-bold text-gray-900 text-base lg:text-lg flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Camp Details
            </div>
            {dateRanges.map((range, index) => (
              <div key={index} className="text-center font-bold text-gray-900 text-base lg:text-lg flex items-center justify-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                <span className="truncate">{range.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Camp Rows */}
        <div className="space-y-4 sm:space-y-6">
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
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                id={workshop.id}
              >
                {/* Mobile Layout - Stacked */}
                <div className="md:hidden p-4 sm:p-6">
                  {/* Camp Header */}
                  <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className={`${workshop.bgColor} rounded-xl p-3 flex-shrink-0 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                        {workshop.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{workshop.level}</p>
                    </div>
                  </div>

                  {/* Date Ranges - Stacked on Mobile */}
                  {dateRanges.map((range, rangeIndex) => {
                    const dateSlots = generateDateSlots(range.dates);
                    if (dateSlots.length === 0) return null;
                    
                    return (
                      <div key={rangeIndex} className="mb-6 last:mb-0">
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                          <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                          {range.label}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {dateSlots.map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-bold text-gray-900">
                                  {slot.date}
                                </div>
                                <div className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                  {slot.day}
                                </div>
                              </div>
                              <div className="space-y-1.5 mb-3">
                                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                  <span className="font-medium">{slot.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                  <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                                  <span className="font-medium">{slot.time}</span>
                                </div>
                                <div className="flex items-center justify-between pt-1.5 border-t border-gray-200">
                                  <span className="text-xs text-gray-600">Price:</span>
                                  <span className="text-sm font-bold text-gray-900">${workshop.price || 75}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleSelect(workshop.id, slot)}
                                disabled={addedItems.has(`${workshop.id}-${slot.date}`)}
                                className={`w-full text-xs py-2 h-auto font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                  addedItems.has(`${workshop.id}-${slot.date}`)
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed'
                                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900'
                                }`}
                              >
                                {addedItems.has(`${workshop.id}-${slot.date}`) ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Added!</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>Add</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Layout - Grid */}
                <div className="hidden md:grid grid-cols-[minmax(200px,1fr)_repeat(2,minmax(150px,1fr))] gap-4 lg:gap-8 px-4 lg:px-8 py-4 lg:py-6 items-start">
                  {/* Left Section - Camp Details */}
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className={`${workshop.bgColor} rounded-xl p-3 lg:p-4 flex-shrink-0 shadow-lg`}>
                      <IconComponent className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base lg:text-lg leading-tight">
                        {workshop.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 mt-1">{workshop.level}</p>
                    </div>
                  </div>

                  {/* Date Columns */}
                  {dateRanges.map((range, rangeIndex) => {
                    const dateSlots = generateDateSlots(range.dates);
                    return (
                      <div key={rangeIndex} className="flex flex-col gap-3 min-w-0">
                        {dateSlots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 rounded-xl p-3 lg:p-4 hover:border-blue-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 w-full cursor-pointer group"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm lg:text-base font-bold text-gray-900">
                                {slot.date}
                              </div>
                              <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                                {slot.day}
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="font-medium">{slot.duration}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                <span className="font-medium">{slot.time}</span>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                <span className="text-xs text-gray-600 font-medium">Price:</span>
                                <span className="text-base lg:text-lg font-bold text-gray-900">${workshop.price || 75}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleSelect(workshop.id, slot)}
                              disabled={addedItems.has(`${workshop.id}-${slot.date}`)}
                              className={`w-full text-xs lg:text-sm py-2 lg:py-2.5 h-auto font-bold shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105 flex items-center justify-center gap-2 ${
                                addedItems.has(`${workshop.id}-${slot.date}`)
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed'
                                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900'
                              }`}
                            >
                              {addedItems.has(`${workshop.id}-${slot.date}`) ? (
                                <>
                                  <Check className="w-3 h-3 lg:w-4 lg:h-4" />
                                  Added!
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
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
    </div>
  );
}

export default function WinterCampCalendarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F396D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    }>
      <WinterCampCalendarContent />
    </Suspense>
  );
}

