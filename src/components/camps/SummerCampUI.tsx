'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  SUMMER_CAMP_PROGRAMS,
  type Program,
  type Level,
  type Slot,
} from '@/lib/summer-camp-data';
import { Button } from '@/components/ui/button';
import { Check, X, ShoppingBag, Clock } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const CART_STORAGE_KEY = 'growwise-summer-camp-cart';

type CartItem = Slot & {
  programTitle: string;
  levelName: string;
  programId: string;
};

let cartListeners: (() => void)[] = [];

export const summerCampCartStore = {
  items: [] as CartItem[],

  subscribe(listener: () => void) {
    cartListeners.push(listener);
    return () => {
      cartListeners = cartListeners.filter((l) => l !== listener);
    };
  },

  notify() {
    cartListeners.forEach((l) => l());
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    }
  },

  add(program: Program, level: Level, slot: Slot) {
    const exists = this.items.find((i) => i.id === slot.id);
    if (exists) return;
    this.items.push({
      ...slot,
      programTitle: program.title,
      levelName: level.name,
      programId: program.id,
    });
    this.notify();
  },

  remove(slotId: string) {
    this.items = this.items.filter((i) => i.id !== slotId);
    this.notify();
  },

  init() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        this.items = JSON.parse(stored);
      } catch {
        this.items = [];
      }
    }
  },
};

if (typeof window !== 'undefined') {
  summerCampCartStore.init();
}

export function ProgramList({
  onSelectProgram,
  selectedProgramId,
}: {
  onSelectProgram: (p: Program) => void;
  selectedProgramId: string | null;
}) {
  const categories = Array.from(
    new Set(SUMMER_CAMP_PROGRAMS.map((p) => p.category))
  );

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div key={category} className="space-y-6">
          <h3 className="font-heading font-bold text-lg text-slate-400 uppercase tracking-[0.2em] pl-1">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUMMER_CAMP_PROGRAMS.filter((p) => p.category === category).map(
              (program) => (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => onSelectProgram(program)}
                  className={`text-left rounded-xl border transition-all duration-300 group relative overflow-hidden flex flex-col h-full
                    ${
                      selectedProgramId === program.id
                        ? 'border-[#1F396D] shadow-lg ring-1 ring-[#1F396D]/20 scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }
                    ${category === 'Half-Day Camps' ? 'bg-sky-50/50' : 'bg-orange-50/50'}
                  `}
                >
                  <div className="w-full h-32 overflow-hidden bg-slate-100 relative">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-2">
                      <h4
                        className={`font-black text-base leading-tight uppercase tracking-tight
                          ${selectedProgramId === program.id ? 'text-[#1F396D]' : 'text-slate-900'}
                          bg-white/50 backdrop-blur-sm inline-block px-2 py-1 rounded-md
                        `}
                      >
                        {program.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                      {program.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <Clock className="w-3 h-3 text-[#1F396D]" />
                        {program.hoursPerWeek}
                      </div>
                      {selectedProgramId === program.id && (
                        <div className="flex items-center text-[#1F396D] text-[10px] font-bold uppercase tracking-widest">
                          Active <Check className="w-3 h-3 ml-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SlotsPanel({ program }: { program: Program }) {
  const [cartItems, setCartItems] = useState(summerCampCartStore.items);

  useEffect(() => {
    return summerCampCartStore.subscribe(
      () => setCartItems([...summerCampCartStore.items])
    );
  }, []);

  const handleAdd = (level: Level, slot: Slot) => {
    summerCampCartStore.add(program, level, slot);
  };

  const handleRemove = (slotId: string) => {
    summerCampCartStore.remove(slotId);
  };

  return (
    <div
      id="slots-panel"
      className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden h-full flex flex-col"
    >
      <div className="p-6 border-b border-slate-50 bg-slate-50/30">
        <h3 className="font-heading font-extrabold text-xl text-slate-900">
          {program.title}
        </h3>
        <p className="text-slate-500 mt-2 text-xs leading-relaxed">
          {program.description}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F396D]/10 text-[#1F396D] text-[10px] font-bold uppercase tracking-widest">
          <Clock className="w-3 h-3" /> {program.hoursPerWeek}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {program.levels.map((level) => (
          <div key={level.id} className="space-y-4">
            <div className="flex flex-col gap-0.5 border-l-2 border-[#1F396D] pl-3">
              <h4 className="font-bold text-sm text-slate-800 uppercase tracking-tight">
                {level.name}
              </h4>
              <span className="text-[10px] text-muted-foreground">
                {level.description}
              </span>
            </div>

            <div className="grid gap-2">
              {level.slots.map((slot) => {
                const inCart = cartItems.some((i) => i.id === slot.id);

                return (
                  <div
                    key={slot.id}
                    className={`
                      relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300
                      ${
                        inCart
                          ? 'bg-green-50/30 border-green-200'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800 text-sm">
                        {slot.label}
                      </div>
                      <div className="text-[9px] text-slate-400 flex items-center gap-2 font-medium uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              slot.format === 'Online'
                                ? 'bg-sky-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          {slot.format}
                        </span>
                        <span>{slot.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                      <div className="font-black text-slate-900 text-base">
                        ${slot.price}
                      </div>
                      {inCart ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(slot.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold h-8 text-[10px]"
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAdd(level, slot)}
                          className="bg-slate-900 text-white hover:bg-[#1F396D] h-8 px-4 text-[10px] font-bold rounded-full"
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CartDrawer() {
  const [items, setItems] = useState(summerCampCartStore.items);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return summerCampCartStore.subscribe(
      () => setItems([...summerCampCartStore.items])
    );
  }, []);

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const locale = useLocale();

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-2xl h-14 px-6 bg-[#1F396D] text-white hover:bg-[#1F396D]/90 hover:scale-105 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <div className="flex flex-col items-start leading-none">
                <span className="font-black text-base">${total}</span>
              </div>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col h-full border-none shadow-2xl">
          <SheetHeader className="border-b border-slate-50 pb-4 mb-4">
            <SheetTitle className="font-heading font-black text-xl flex items-center gap-2">
              Cart{' '}
              <span className="text-[10px] font-bold text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                {items.length} items
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag className="w-10 h-10 text-slate-200" />
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  Empty Cart
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-[10px]"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Browsing
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl p-4 border border-slate-100 relative transition-all hover:shadow-sm"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#1F396D]" />
                  <button
                    type="button"
                    onClick={() => summerCampCartStore.remove(item.id)}
                    className="absolute top-3 right-3 p-1 text-slate-300 hover:text-red-500 rounded-full transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <h4 className="font-black text-slate-900 text-[10px] mb-0.5 uppercase tracking-tight">
                    {item.programTitle}
                  </h4>
                  <div className="text-[8px] text-[#1F396D] font-bold uppercase tracking-widest mb-2">
                    {item.levelName}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400 text-[10px]">
                      {item.label}
                    </span>
                    <span className="font-black text-sm text-slate-900">
                      ${item.price}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-50 pt-6 mt-auto">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                Total
              </span>
              <span className="font-heading font-black text-3xl tracking-tighter">
                ${total}
              </span>
            </div>
            <Button
              className="w-full h-14 text-lg font-black rounded-xl shadow-lg bg-[#1F396D] hover:bg-[#1F396D]/90"
              disabled={items.length === 0}
              asChild
            >
              <Link href={`/${locale}/checkout`}>BOOK NOW</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
