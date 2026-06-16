import { Flame, Box, Thermometer, FlaskConical, Clock, Package, Receipt, CheckCircle, ChevronRight, Eye, PlayCircle, ArrowRight, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PROCESS_STEPS, STEP_NAMES, PRODUCT_TYPE_NAMES } from '../types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const stepIcons = [Flame, Box, Thermometer, FlaskConical, Clock, Package, Receipt];

const stepKeys = ['grinding', 'pressing', 'cultivation', 'bottling', 'fermentation', 'packaging', 'sales'];

export function BatchFlowBoard() {
  const { batches, selectedBatch, selectBatch, getBatchHistory, setShowBatchDetail } = useAppStore();
  const navigate = useNavigate();
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  const getStepStatus = (batch: typeof batches[0], stepId: number) => {
    if (batch.currentStep > stepId) return 'completed';
    if (batch.currentStep === stepId) return 'current';
    return 'pending';
  };

  const handleStepClick = (step: typeof PROCESS_STEPS[0], batch: typeof batches[0]) => {
    const status = getStepStatus(batch, step.id);
    if (status === 'completed' || status === 'current') {
      selectBatch(batch);
      setShowBatchDetail(true);
    } else if (status === 'pending') {
      const prevStep = PROCESS_STEPS.find(s => s.id === step.id - 1);
      if (prevStep && getStepStatus(batch, prevStep.id) === 'completed') {
        goToStep(step, batch);
      }
    }
  };

  const goToStep = (step: typeof PROCESS_STEPS[0], batch: typeof batches[0]) => {
    selectBatch(batch);
    navigate(step.route);
  };

  const toggleExpand = (batchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-serif font-semibold text-cream-900">批次流转看板</h3>
          <span className="text-xs text-cream-500 bg-cream-100 px-2 py-1 rounded-full">
            共 {batches.length} 批次
          </span>
        </div>
        <p className="text-sm text-cream-500">点击批次展开详情，点击步骤可跳转或查看记录</p>
      </div>

      <div className="space-y-3">
        {batches.map((batch, batchIndex) => {
          const isSelected = selectedBatch?.id === batch.id;
          const isExpanded = expandedBatch === batch.id;
          const history = isExpanded ? getBatchHistory(batch.id) : null;
          const nextStep = PROCESS_STEPS.find(s => s.id === batch.currentStep + 1);
          const currentStep = PROCESS_STEPS.find(s => s.id === batch.currentStep);

          return (
            <div 
              key={batch.id}
              className={`rounded-xl border-2 transition-all duration-300 overflow-hidden
                ${isSelected 
                  ? 'border-primary-400 bg-primary-50/50' 
                  : 'border-cream-200 bg-white hover:border-primary-200'}`}
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => {
                  selectBatch(isSelected ? null : batch);
                  setExpandedBatch(isExpanded ? null : batch.id);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-cream-900">{batch.batchNumber}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                        ${batch.productType === 'red' ? 'bg-primary-100 text-primary-700 border-primary-200' :
                          batch.productType === 'green' ? 'bg-green-100 text-green-700 border-green-200' :
                          'bg-cream-200 text-cream-800 border-cream-300'}`}>
                        {PRODUCT_TYPE_NAMES[batch.productType]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-cream-500">开始日期</p>
                      <p className="text-sm font-medium text-cream-800">{batch.startDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-cream-500">预计产量</p>
                      <p className="text-sm font-medium text-cream-800">{batch.totalOutput.toLocaleString()} 瓶</p>
                    </div>
                    <button
                      onClick={(e) => toggleExpand(batch.id, e)}
                      className={`p-2 rounded-lg transition-colors ${
                        isExpanded ? 'bg-primary-100 text-primary-600' : 'bg-cream-100 text-cream-500 hover:bg-cream-200'
                      }`}
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute top-6 left-0 right-0 h-1 bg-cream-200 -z-10">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${Math.min(100, ((batch.currentStep - 1) / (PROCESS_STEPS.length - 1)) * 100)}%` 
                      }}
                    />
                  </div>

                  <div className="flex justify-between">
                    {PROCESS_STEPS.map((step, stepIndex) => {
                      const Icon = stepIcons[stepIndex];
                      const status = getStepStatus(batch, step.id);
                      const stepKey = stepKeys[stepIndex];
                      const hasRecord = history && history[stepKey as keyof typeof history];

                      return (
                        <div 
                          key={step.id}
                          className="flex flex-col items-center relative group"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepClick(step, batch);
                          }}
                        >
                          <div 
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 z-10 cursor-pointer
                              ${status === 'completed' ? 'bg-green-500 text-white shadow-md shadow-green-200' :
                                status === 'current' ? 'bg-primary-500 text-white shadow-md shadow-primary-200 animate-pulse ring-4 ring-primary-200' :
                                'bg-cream-200 text-cream-400 hover:bg-cream-300'}`}
                          >
                            {status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          
                          <div className="mt-1.5 text-center">
                            <p className={`text-xs font-medium ${
                              status === 'completed' ? 'text-green-700' :
                              status === 'current' ? 'text-primary-700 font-semibold' : 'text-cream-400'
                            }`}>
                              {step.name.charAt(0)}
                            </p>
                          </div>

                          {hasRecord && (
                            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white text-[8px] text-white font-bold">
                              ✓
                            </div>
                          )}

                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            <div className="bg-cream-900 text-cream-100 text-xs px-3 py-2 rounded-lg whitespace-nowrap min-w-[120px]">
                              <p className="font-medium">{step.name}</p>
                              <p className="text-cream-400 mt-0.5">{step.description}</p>
                              {status === 'current' && (
                                <p className="text-primary-400 mt-1 font-medium">↗ 当前工序，点击进入</p>
                              )}
                              {status === 'completed' && (
                                <p className="text-green-400 mt-1">✓ 已完成，点击查看记录</p>
                              )}
                              {status === 'pending' && stepIndex === batch.currentStep && (
                                <p className="text-amber-400 mt-1">→ 下一步，点击前往</p>
                              )}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-cream-900" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`status-badge ${
                      batch.status === 'completed' || batch.status === 'sold' 
                        ? 'status-normal' 
                        : batch.status === 'packaging' 
                          ? 'status-warning' 
                          : 'status-alert'
                    }`}>
                      {STEP_NAMES[batch.status]}
                    </span>
                    <span className="text-sm text-cream-500">
                      进度: {Math.round((batch.currentStep / 7) * 100)}% ({batch.currentStep}/7步)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectBatch(batch);
                        setShowBatchDetail(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-cream-100 text-cream-700 rounded-lg text-sm font-medium hover:bg-cream-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      查看履历
                    </button>
                    
                    {currentStep && batch.status !== 'completed' && batch.status !== 'sold' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToStep(currentStep, batch);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-md shadow-primary-200"
                      >
                        <PlayCircle className="w-4 h-4" />
                        去处理
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-cream-200 pt-3 bg-cream-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-primary-500" />
                    <p className="text-sm font-medium text-cream-800">流转详情</p>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {PROCESS_STEPS.map((step, stepIndex) => {
                      const status = getStepStatus(batch, step.id);
                      const stepKey = stepKeys[stepIndex];
                      const record = history?.[stepKey as keyof typeof history];
                      const hasRecord = record && (!Array.isArray(record) || record.length > 0);
                      
                      return (
                        <div 
                          key={step.id}
                          className={`p-2 rounded-lg text-center transition-all ${
                            status === 'completed' ? 'bg-green-100 border border-green-200' :
                            status === 'current' ? 'bg-primary-100 border border-primary-200' :
                            'bg-cream-100 border border-dashed border-cream-300'
                          }`}
                        >
                          <p className={`text-xs font-semibold mb-1 ${
                            status === 'completed' ? 'text-green-700' :
                            status === 'current' ? 'text-primary-700' : 'text-cream-400'
                          }`}>
                            {step.name.charAt(0)}
                          </p>
                          {hasRecord ? (
                            <p className="text-[10px] text-green-600">✓ 有记录</p>
                          ) : status === 'current' ? (
                            <p className="text-[10px] text-primary-600 animate-pulse">进行中</p>
                          ) : (
                            <p className="text-[10px] text-cream-400">待开始</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {nextStep && batch.status !== 'completed' && batch.status !== 'sold' && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-primary-50 to-amber-50 rounded-lg border border-primary-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-cream-500">下一步</p>
                          <p className="text-sm font-semibold text-primary-800">
                            {nextStep.name} - {nextStep.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToStep(nextStep, batch);
                          }}
                          className="flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                        >
                          前往处理
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
