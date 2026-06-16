import { X, Flame, Box, Thermometer, FlaskConical, Clock, Package, Receipt, CheckCircle, Circle, ArrowRight, Calendar, User } from 'lucide-react';
import { useAppStore, type BatchHistory } from '../store/useAppStore';
import { PROCESS_STEPS, PRODUCT_TYPE_NAMES, STEP_NAMES } from '../types';
import { useNavigate } from 'react-router-dom';

const stepConfig = [
  { key: 'grinding', name: '磨浆点卤', icon: Flame, color: 'orange', description: '黄豆磨浆煮浆、点卤凝固' },
  { key: 'pressing', name: '压坯划块', icon: Box, color: 'green', description: '压榨成坯、白坯切块摆笼' },
  { key: 'cultivation', name: '前期培菌', icon: Thermometer, color: 'red', description: '毛霉接种培菌、温湿控制' },
  { key: 'bottling', name: '搓毛装坛', icon: FlaskConical, color: 'amber', description: '搓毛腌坯、加料汤装坛' },
  { key: 'fermentation', name: '后期发酵', icon: Clock, color: 'blue', description: '红方青方调味、后发酵' },
  { key: 'packaging', name: '装瓶贴标', icon: Package, color: 'purple', description: '装瓶灌汤封口、标签管理' },
  { key: 'sales', name: '销售台账', icon: Receipt, color: 'primary', description: '销售订单、财务统计' },
];

const colorClasses = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  primary: { bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-200', dot: 'bg-primary-500' },
};

export function BatchDetailModal() {
  const { selectedBatch, showBatchDetail, setShowBatchDetail, getBatchHistory, selectBatch } = useAppStore();
  const navigate = useNavigate();

  if (!selectedBatch || !showBatchDetail) return null;

  const history = getBatchHistory(selectedBatch.id);

  const getStepStatus = (stepKey: string) => {
    const stepIndex = stepConfig.findIndex(s => s.key === stepKey);
    const currentStepIndex = selectedBatch.currentStep - 1;
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const handleGoToStep = (stepKey: string) => {
    const step = PROCESS_STEPS.find(s => s.name === stepConfig.find(c => c.key === stepKey)?.name);
    if (step) {
      setShowBatchDetail(false);
      selectBatch(selectedBatch);
      navigate(step.route);
    }
  };

  const renderRecord = (key: keyof BatchHistory) => {
    const record = history[key];
    const status = getStepStatus(key);
    
    if (status === 'pending') {
      return (
        <div className="p-4 bg-cream-50 rounded-lg border-2 border-dashed border-cream-300">
          <div className="flex items-center gap-2 text-cream-400">
            <Circle className="w-5 h-5" />
            <span className="text-sm font-medium">待开始</span>
          </div>
          <p className="text-xs text-cream-400 mt-1">当前工序尚未开始，完成上一步后可进入此工序</p>
        </div>
      );
    }

    if (!record || (Array.isArray(record) && record.length === 0)) {
      return (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">暂无记录</span>
          </div>
          <p className="text-xs text-amber-500 mt-1">该工序已进入，但尚未保存记录</p>
        </div>
      );
    }

    if (key === 'sales') {
      const sales = record as BatchHistory['sales'];
      return (
        <div className="space-y-3">
          {sales.map((order, idx) => (
            <div key={order.id} className="p-4 bg-gradient-to-r from-cream-50 to-white rounded-lg border border-cream-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-cream-900">订单 #{idx + 1}</p>
                    <p className="text-xs text-cream-500">{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <span className={`status-badge ${
                  order.status === 'completed' ? 'status-normal' :
                  order.status === 'shipped' ? 'status-warning' : 'status-alert'
                }`}>
                  {order.status === 'completed' ? '已完成' :
                   order.status === 'shipped' ? '已发货' : '待处理'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-cream-500 mb-0.5">客户</p>
                  <p className="text-sm font-medium text-cream-800">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-cream-500 mb-0.5">产品</p>
                  <p className="text-sm font-medium text-cream-800">{order.productType}</p>
                </div>
                <div>
                  <p className="text-xs text-cream-500 mb-0.5">数量</p>
                  <p className="text-sm font-medium text-cream-800">{order.quantity.toLocaleString()} 瓶</p>
                </div>
                <div>
                  <p className="text-xs text-cream-500 mb-0.5">单价</p>
                  <p className="text-sm font-medium text-cream-800">¥{order.unitPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-cream-500 mb-0.5">总金额</p>
                  <p className="text-sm font-bold text-primary-600">¥{order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-cream-500 mb-0.5">日期</p>
                  <p className="text-sm font-medium text-cream-800">{order.saleDate}</p>
                </div>
              </div>
              {order.notes && (
                <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200">
                  <p className="text-xs text-amber-600">备注: {order.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    const rec = record as Exclude<BatchHistory[keyof BatchHistory], null | BatchHistory['sales']>;
    const fields = Object.entries(rec).filter(([k]) => !['id', 'batchId', 'createdAt', 'notes'].includes(k));
    
    const labelMap: Record<string, string> = {
      soybeanAmount: '黄豆用量',
      waterAmount: '用水量',
      cookingTemp: '煮浆温度',
      cookingTime: '煮浆时间',
      coagulantType: '凝固剂类型',
      coagulantAmount: '凝固剂用量',
      solidificationStatus: '凝固状态',
      pressure: '压榨压力',
      pressingTime: '压榨时间',
      blankSize: '白坯规格',
      blankCount: '白坯数量',
      arrangementPattern: '摆笼方式',
      moldStrain: '菌株类型',
      inoculationAmount: '接种量',
      temperature: '培养温度',
      humidity: '培养湿度',
      cultivationDays: '培菌天数',
      myceliumStatus: '菌丝状态',
      rubbingQuality: '搓毛质量',
      saltAmount: '食盐用量',
      marinatingTime: '腌坯时间',
      soupFormula: '料汤配方',
      jarCount: '装坛数量',
      flavorType: '风味类型',
      seasoningFormula: '调味配方',
      fermentationTemp: '发酵温度',
      fermentationDays: '发酵天数',
      maturityLevel: '成熟度',
      bottleCount: '装瓶数量',
      soupStandard: '灌汤标准',
      sealingQuality: '封口质量',
      labelType: '标签类型',
    };
    
    const unitMap: Record<string, string> = {
      soybeanAmount: 'kg',
      waterAmount: 'kg',
      cookingTemp: '°C',
      cookingTime: '分钟',
      coagulantAmount: 'kg',
      pressure: 'kg/cm²',
      pressingTime: '分钟',
      blankCount: '块',
      inoculationAmount: '%',
      temperature: '°C',
      humidity: '%',
      cultivationDays: '天',
      saltAmount: 'kg',
      marinatingTime: '小时',
      jarCount: '坛',
      fermentationTemp: '°C',
      fermentationDays: '天',
      bottleCount: '瓶',
    };

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {fields.map(([key, value]) => (
            <div key={key} className="p-3 bg-cream-50 rounded-lg">
              <p className="text-xs text-cream-500 mb-1">{labelMap[key] || key}</p>
              <p className="font-semibold text-cream-900">
                {value}
                {unitMap[key] && <span className="text-cream-500 font-normal text-sm ml-1">{unitMap[key]}</span>}
              </p>
            </div>
          ))}
        </div>
        {rec.notes && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-600 mb-1 font-medium">备注信息</p>
            <p className="text-sm text-amber-800">{rec.notes}</p>
          </div>
        )}
        {rec.createdAt && (
          <div className="flex items-center gap-1 text-xs text-cream-500">
            <Calendar className="w-3 h-3" />
            <span>记录时间: {rec.createdAt}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-cream-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-cream-200 bg-gradient-to-r from-cream-50 via-white to-cream-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-md">
              <FlaskConical className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-cream-900">
                批次完整履历
              </h2>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="font-mono text-sm font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                  {selectedBatch.batchNumber}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                  ${selectedBatch.productType === 'red' ? 'bg-primary-100 text-primary-700 border-primary-200' :
                    selectedBatch.productType === 'green' ? 'bg-green-100 text-green-700 border-green-200' :
                    'bg-cream-200 text-cream-800 border-cream-300'}`}>
                  {PRODUCT_TYPE_NAMES[selectedBatch.productType]}
                </span>
                <span className={`status-badge ${
                  selectedBatch.status === 'completed' || selectedBatch.status === 'sold' 
                    ? 'status-normal' 
                    : 'status-warning'
                }`}>
                  {STEP_NAMES[selectedBatch.status]}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowBatchDetail(false)}
            className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5 text-cream-600" />
          </button>
        </div>

        <div className="px-6 py-4 bg-cream-50 border-b border-cream-200">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cream-500" />
              <span className="text-cream-600">开始日期:</span>
              <span className="font-medium text-cream-800">{selectedBatch.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-cream-500" />
              <span className="text-cream-600">预计产量:</span>
              <span className="font-medium text-cream-800">{selectedBatch.totalOutput.toLocaleString()} 瓶</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-cream-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                  style={{ width: `${(selectedBatch.currentStep / 7) * 100}%` }}
                />
              </div>
              <span className="font-semibold text-primary-600">
                {Math.round((selectedBatch.currentStep / 7) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative">
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary-300 via-primary-200 to-cream-200" />
            
            {stepConfig.map((step, index) => {
              const status = getStepStatus(step.key);
              const Icon = step.icon;
              const colors = colorClasses[step.color as keyof typeof colorClasses];
              const processStep = PROCESS_STEPS.find(s => s.name === step.name);
              
              return (
                <div key={step.key} className="relative flex gap-4 mb-6 last:mb-0">
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    ${status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
                      status === 'current' ? 'bg-primary-500 text-white shadow-lg shadow-primary-200 ring-4 ring-primary-100' :
                      'bg-cream-200 text-cream-400 border-2 border-dashed border-cream-300'}`}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`text-lg font-semibold ${
                        status === 'completed' ? 'text-green-700' :
                        status === 'current' ? 'text-primary-700' : 'text-cream-400'
                      }`}>
                        {step.name}
                      </h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        status === 'completed' ? 'bg-green-100 text-green-700' :
                        status === 'current' ? 'bg-primary-100 text-primary-700' : 'bg-cream-100 text-cream-500'
                      }`}>
                        {status === 'completed' ? '✓ 已完成' :
                         status === 'current' ? '● 进行中' : '○ 待开始'}
                      </span>
                      <span className="text-xs text-cream-400">第 {index + 1} 步</span>
                    </div>
                    
                    <p className="text-sm text-cream-500 mb-3">{step.description}</p>
                    
                    {renderRecord(step.key as keyof BatchHistory)}
                    
                    {status === 'current' && processStep && (
                      <button
                        onClick={() => handleGoToStep(step.key)}
                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-md shadow-primary-200"
                      >
                        前往此工序处理
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-cream-200 bg-cream-50 flex items-center justify-between">
          <div className="text-sm text-cream-600">
            当前状态: <span className="font-semibold text-cream-900">{STEP_NAMES[selectedBatch.status]}</span>
            {selectedBatch.status !== 'completed' && selectedBatch.status !== 'sold' && (
              <span className="ml-4">
                剩余 <span className="font-semibold text-primary-600">{7 - selectedBatch.currentStep}</span> 个工序
              </span>
            )}
          </div>
          <button
            onClick={() => setShowBatchDetail(false)}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
