import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { ErrorPattern, RiskLevel } from '@/lib/patterns';

interface PatternCardProps {
  pattern: ErrorPattern;
  variant?: 'confirmed' | 'possible';
}

const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; badgeClass: string; iconClass: string; Icon: React.ElementType }
> = {
  HIGH: {
    label: 'HIGH RISK',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    iconClass: 'text-red-500',
    Icon: AlertTriangle,
  },
  MEDIUM: {
    label: 'MEDIUM RISK',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    iconClass: 'text-amber-500',
    Icon: AlertCircle,
  },
  LOW: {
    label: 'LOW RISK',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    iconClass: 'text-blue-500',
    Icon: Info,
  },
};

export default function PatternCard({ pattern, variant = 'confirmed' }: PatternCardProps) {
  const { label, badgeClass, iconClass, Icon } = RISK_CONFIG[pattern.riskLevel];
  const isPossible = variant === 'possible';

  return (
    <Card className={`border ${isPossible ? 'opacity-80 border-dashed' : 'border-solid'}`}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 flex-shrink-0 ${iconClass}`} aria-hidden />
            <h3 className="font-semibold text-gray-900 text-base leading-snug">
              {pattern.title}
            </h3>
          </div>
          <Badge className={`text-xs font-semibold whitespace-nowrap border ${badgeClass}`}>
            {isPossible ? 'POSSIBLE' : label}
          </Badge>
        </div>

        <p className="text-xs text-gray-500 font-medium">{pattern.commonGrades}</p>

        <p className="text-sm text-gray-700 leading-relaxed">{pattern.description}</p>

        <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
          <span className="font-semibold">Blocks: </span>
          {pattern.blocksNext}
        </div>
      </CardContent>
    </Card>
  );
}
