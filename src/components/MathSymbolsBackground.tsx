'use client';

import { useHydration } from '@/hooks/useHydration';
import { generateSeededArray } from '@/utils/randomUtils';

interface MathSymbolsBackgroundProps {
  scrollY: number;
  seed?: number;
}

const mathSymbols = ['∑', '∞', 'π', '√', '∫', '∆', 'α', 'β', '≠', '±', '÷', '×', '²', '³', '°'];

export default function MathSymbolsBackground({ scrollY, seed = 12345 }: MathSymbolsBackgroundProps) {
  const { isHydrated } = useHydration();

  if (!isHydrated) {
    return <div className="absolute inset-0" />;
  }

  const symbols = generateSeededArray(15, (index, random) => ({
    id: index,
    symbol: mathSymbols[Math.floor(random * mathSymbols.length)],
    left: random * 100,
    top: random * 100,
    fontSize: 18 + random * 15,
    animationDelay: index * 1.2,
    animationDuration: 8 + random * 4
  }), seed);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className="absolute text-gray-500/60 animate-float-gentle font-semibold"
          style={{
            left: `${symbol.left}%`,
            top: `${symbol.top}%`,
            transform: `translateY(${scrollY * 0.05}px)`,
            animationDelay: `${symbol.animationDelay}s`,
            animationDuration: `${symbol.animationDuration}s`,
            fontSize: `${symbol.fontSize}px`
          }}
        >
          {symbol.symbol}
        </div>
      ))}
    </div>
  );
}
