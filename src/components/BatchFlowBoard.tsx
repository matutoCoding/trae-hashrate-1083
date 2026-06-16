import { Flame, Box, Thermometer, FlaskConical, Clock, Package, Receipt, CheckCircle, ChevronRight, Eye } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PROCESS_STEPS, STEP_NAMES, PRODUCT_TYPE_NAMES } from '../types';
import { useNavigate } from 'react-router-dom';

const stepIcons = [Flame, Box, Thermometer, FlaskConical, Clock, Package, Receipt];

export function BatchFlowBoard() {
  const { batches, selectedBatch, selectBatch, getBatchHistory, setShowBatchDetail } = useAppStore();
  const navigate = useNavigate();

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
        navigate(step.route);
      }
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif font-semibold text-cream-900">批次流程看板</h3>
        <p className="text-sm text-cream-500">点击批次查看完整履历，点击步骤可跳转或查看详情</p>
      </div>

      <div className="space-y-4">
        {batches.map((batch, batchIndex) => (
          <div 
            key={batch.id}
            className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
              ${selectedBatch?.id === batch.id 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-cream-200 bg-white hover:border-primary-200'}`}
            onClick={() => selectBatch(selectedBatch?.id === batch.id ? null : batch)}
          >
            <div className="flex items-center justify-between mb-4">
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
                <div className="text-sm text-cream-600">
                  开始日期: {batch.startDate} | 预计产量: {batch.totalOutput.toLocaleString()} 瓶
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectBatch(batch);
                  setShowBatchDetail(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                查看履历
              </button>
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
                  const history = selectedBatch?.id === batch.id ? getBatchHistory(batch.id) : null;
                  const hasRecord = history && history[step.name.split('')[0].toLowerCase() as keyof typeof history];

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
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10
                          ${status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
                            status === 'current' ? 'bg-primary-500 text-white shadow-lg shadow-primary-200 animate-pulse' :
                            'bg-cream-200 text-cream-500'}`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="mt-2 text-center">
                        <p className={`text-xs font-medium ${
                          status === 'completed' ? 'text-green-700' :
                          status === 'current' ? 'text-primary-700' : 'text-cream-500'
                        }`}>
                          {step.name.split('')[0]}
                        </p>
                      </div>

                      {hasRecord && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                          ✓
                        </div>
                      )}

                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <div className="bg-cream-900 text-cream-100 text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                          <p className="font-medium">{step.name}</p>
                          <p className="text-cream-400">{step.description}</p>
                          {status === 'current' && (
                            <p className="text-primary-400 mt-1">→ 点击进入当前工序</p>
                          )}
                          {hasRecord && (
                            <p className="text-green-400 mt-1">✓ 已有记录，点击查看详情</p>
                          )}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-cream-900" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
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
                {batch.status !== 'completed' && batch.status !== 'sold' && (
                  <span className="text-cream-500">
                    进度: {Math.round((batch.currentStep / 7) * 100)}%
                  </span>
                )}
              </div>
              {batch.currentStep < 7 && batch.status !== 'completed' && batch.status !== 'sold' && (
                <div className="flex items-center gap-1 text-primary-600">
                  <span>下一步: {PROCESS_STEPS.find(s => s.id === batch.currentStep + 1)?.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
