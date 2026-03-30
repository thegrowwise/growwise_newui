'use client';

import { DeliveryMode } from '@/hooks/usePricingConfig';
import { cn } from '@/components/ui/utils';
import { useTranslations } from 'next-intl';
import { MonitorPlay, Users } from 'lucide-react';

interface DeliveryModeToggleProps {
  value: DeliveryMode;
  onChange: (mode: DeliveryMode) => void;
  studioOnly?: boolean;
  className?: string;
}

export function DeliveryModeToggle({
  value,
  onChange,
  studioOnly,
  className,
}: DeliveryModeToggleProps) {
  const t = useTranslations();
  const liveLabel = t('pricingUi.deliveryMode.live');
  const studioLabel = t('pricingUi.deliveryMode.studio');
  const studioOnlyLabel = t('pricingUi.deliveryMode.studioOnlyBadge');

  if (studioOnly) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-800 border border-orange-200',
          className,
        )}
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-semibold tracking-wide uppercase">
          {studioOnlyLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex p-1 bg-muted rounded-full relative shadow-inner',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange('live')}
        className={cn(
          'relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors',
          value === 'live'
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <MonitorPlay className="w-4 h-4" />
        {liveLabel}
      </button>

      <button
        type="button"
        onClick={() => onChange('studio')}
        className={cn(
          'relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors',
          value === 'studio'
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <Users className="w-4 h-4" />
        {studioLabel}
      </button>

      {/* Active pill background */}
      <div
        className="absolute inset-y-1 bg-primary rounded-full shadow-md transition-all duration-300"
        style={{
          left: value === 'live' ? '4px' : '50%',
          right: value === 'live' ? '50%' : '4px',
        }}
      />
    </div>
  );
}