'use client';

import { DeliveryMode } from '@/hooks/usePricingConfig';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { useTranslations } from 'next-intl';

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
      <div className={cn('inline-flex items-center gap-2', className)}>
        <Badge className="rounded-full bg-[#F16112]/10 px-3 py-1 text-xs font-semibold text-[#F16112]">
          {studioOnlyLabel}
        </Badge>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-gray-100 p-1',
        className,
      )}
    >
      <Button
        type="button"
        variant={value === 'live' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          'rounded-full px-4 py-1 text-xs',
          value === 'live' && 'bg-[#F16112] hover:bg-[#F1894F] text-white',
        )}
        onClick={() => onChange('live')}
      >
        {liveLabel}
      </Button>
      <Button
        type="button"
        variant={value === 'studio' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          'rounded-full px-4 py-1 text-xs',
          value === 'studio' && 'bg-[#1F396D] hover:bg-[#243f78] text-white',
        )}
        onClick={() => onChange('studio')}
      >
        {studioLabel}
      </Button>
    </div>
  );
}