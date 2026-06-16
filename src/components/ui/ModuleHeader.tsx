import { LucideIcon, ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProcessProgress } from '../Layout/ProcessProgress';

interface ModuleHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  currentStep: number;
  showProgress?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
}

export function ModuleHeader({
  title,
  description,
  icon: Icon,
  currentStep,
  showProgress = true,
  showAddButton = false,
  onAddClick,
  addButtonText = '新增记录',
}: ModuleHeaderProps) {
  return (
    <div className="mb-6 opacity-0 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-2">
        <Link 
          to="/" 
          className="p-2 hover:bg-cream-200 rounded-lg transition-colors text-cream-600 hover:text-cream-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-cream-900">{title}</h1>
          <p className="text-sm text-cream-600">{description}</p>
        </div>
        {showAddButton && (
          <button 
            onClick={onAddClick}
            className="ml-auto btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {addButtonText}
          </button>
        )}
      </div>
      {showProgress && (
        <div className="mt-4 card p-4">
          <ProcessProgress currentStep={currentStep} showLabels={false} />
        </div>
      )}
    </div>
  );
}
