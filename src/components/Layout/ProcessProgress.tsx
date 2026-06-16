import { Check, Flame, Box, Thermometer, FlaskConical, Clock, Package, Receipt } from 'lucide-react';
import { PROCESS_STEPS } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Link } from 'react-router-dom';

const iconMap: Record<string, typeof Flame> = {
  Flame,
  Box,
  Thermometer,
  FlaskConical,
  Clock,
  Package,
  Receipt,
};

interface ProcessProgressProps {
  currentStep: number;
  showLabels?: boolean;
}

export function ProcessProgress({ currentStep, showLabels = true }: ProcessProgressProps) {
  const { getActiveBatches } = useAppStore();
  const activeBatches = getActiveBatches();

  const getStatus = (stepId: number): 'completed' | 'current' | 'pending' => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-cream-200 -z-10">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${((currentStep - 1) / (PROCESS_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {PROCESS_STEPS.map((step, index) => {
          const status = getStatus(step.id);
          const Icon = iconMap[step.icon];
          const batchInStep = activeBatches.filter(b => b.currentStep === step.id).length;

          return (
            <Link
              key={step.id}
              to={step.route}
              className="flex flex-col items-center group relative"
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${status === 'completed' ? 'bg-fermentation-normal text-white' : ''}
                ${status === 'current' ? 'bg-primary-600 text-white ring-4 ring-primary-100 animate-breathing' : ''}
                ${status === 'pending' ? 'bg-cream-200 text-cream-500 group-hover:bg-cream-300' : ''}
              `}>
                {status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              
              {batchInStep > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {batchInStep}
                </span>
              )}

              {showLabels && (
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium transition-colors
                    ${status === 'completed' ? 'text-fermentation-normal' : ''}
                    ${status === 'current' ? 'text-primary-600' : ''}
                    ${status === 'pending' ? 'text-cream-500 group-hover:text-cream-700' : ''}
                  `}>
                    {step.name}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
