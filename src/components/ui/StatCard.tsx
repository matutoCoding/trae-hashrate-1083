import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'amber' | 'green' | 'blue';
  delay?: number;
}

const colorClasses = {
  primary: 'from-primary-500 to-primary-700',
  amber: 'from-amber-500 to-amber-700',
  green: 'from-fermentation-normal to-green-700',
  blue: 'from-blue-500 to-blue-700',
};

export function StatCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  color = 'primary',
  delay = 0 
}: StatCardProps) {
  return (
    <div 
      className="card opacity-0 animate-stagger-1"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-cream-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-cream-900 font-serif">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-sm text-cream-500">{unit}</span>}
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-fermentation-normal' : 'text-fermentation-alert'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-cream-500">较上月</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
