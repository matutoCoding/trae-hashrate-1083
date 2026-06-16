import { X, Flame, Box, Thermometer, FlaskConical, Clock, Package, Receipt, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { useAppStore, type BatchHistory } from '../store/useAppStore';
import { PROCESS_STEPS, PRODUCT_TYPE_NAMES, STEP_NAMES } from '../types';

const stepConfig = [
  { key: 'grinding', name: '磨浆点卤', icon: Flame, color: 'orange' },
  { key: 'pressing', name: '压坯划块', icon: Box, color: 'green' },
  { key: 'cultivation', name: '前期培菌', icon: Thermometer, color: 'red' },
  { key: 'bottling', name: '搓毛装坛', icon: FlaskConical, color: 'amber' },
  { key: 'fermentation', name: '后期发酵', icon: Clock, color: 'blue' },
  { key: 'packaging', name: '装瓶贴标', icon: Package, color: 'purple' },
  { key: 'sales', name: '销售台账', icon: Receipt, color: 'primary' },
];

const colorClasses = {
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
};

export function BatchDetailModal() {
  const { selectedBatch, showBatchDetail, setShowBatchDetail, getBatchHistory } = useAppStore();

  if (!selectedBatch || !showBatchDetail) return null;

  const history = getBatchHistory(selectedBatch.id);

  const getStepStatus = (stepKey: string) => {
    const stepIndex = stepConfig.findIndex(s => s.key === stepKey);
    const currentStepIndex = selectedBatch.currentStep - 1;
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const renderRecord = (key: keyof BatchHistory) => {
    const record = history[key];
    if (!record || (Array.isArray(record) && record.length === 0)) {
      return <p className="text-cream-500 text-sm">暂无记录</p>;
    }

    if (key === 'sales') {
      const sales = record as BatchHistory['sales'];
      return (
        <div className="space-y-2">
          {sales.map((order, idx) => (
            <div key={order.id} className="p-3 bg-cream-50 rounded-lg border border-cream-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream-900">订单 #{idx + 1}</span>
                <span className={`status-badge ${
                  order.status === 'completed' ? 'status-normal' :
                  order.status === 'shipped' ? 'status-warning' : 'status-alert'
                }`}>
                  {order.status === 'completed' ? '已完成' :
                   order.status === 'shipped' ? '已发货' : '待处理'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-cream-500">客户:</span> {order.customerName}
                </div>
                <div>
                  <span className="text-cream-500">产品:</span> {order.productType}
                </div>
                <div>
                  <span className="text-cream-500">数量:</span> {order.quantity.toLocaleString()} 瓶
                </div>
                <div>
                  <span className="text-cream-500">金额:</span> ¥{order.totalAmount.toLocaleString()}
                </div>
                <div className="col-span-2">
                  <span className="text-cream-500">日期:</span> {order.saleDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const rec = record as Exclude<BatchHistory[keyof BatchHistory], null | BatchHistory['sales']>;
    const fields = Object.entries(rec).filter(([k]) => !['id', 'batchId', 'createdAt', 'notes'].includes(k));
    
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {fields.map(([key, value]) => {
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
              <div key={key} className="p-2 bg-cream-50 rounded-lg">
                <p className="text-xs text-cream-500 mb-0.5">{labelMap[key] || key}</p>
                <p className="font-medium text-cream-900">
                  {value}
                  {unitMap[key] && <span className="text-cream-500 text-sm ml-1">{unitMap[key]}</span>}
                </p>
              </div>
            );
          })}
        </div>
        {'notes' in rec && rec.notes && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700 mb-1">备注</p>
            <p className="text-sm text-amber-900">{rec.notes}</p>
          </div>
        )}
        {'createdAt' in rec && (
          <p className="text-xs text-cream-500">记录时间: {rec.createdAt}</p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-cream-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-cream-200 bg-gradient-to-r from-cream-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
              <FlaskConical className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-cream-900">
                批次详情 - {selectedBatch.batchNumber}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                  ${selectedBatch.productType === 'red' ? 'bg-primary-100 text-primary-700 border-primary-200' :
                    selectedBatch.productType === 'green' ? 'bg-green-100 text-green-700 border-green-200' :
                    'bg-cream-200 text-cream-800 border-cream-300'}`}>
                  {PRODUCT_TYPE_NAMES[selectedBatch.productType]}
                </span>
                <span className="text-sm text-cream-600">
                  开始日期: {selectedBatch.startDate}
                </span>
                <span className="text-sm text-cream-600">
                  预计产量: {selectedBatch.totalOutput.toLocaleString()} 瓶
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-cream-700 mb-3">生产流程进度</h3>
            <div className="flex items-center gap-1">
              {stepConfig.map((step, index) => {
                const status = getStepStatus(step.key);
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === 'completed' ? 'bg-green-500 text-white' :
                        status === 'current' ? 'bg-primary-500 text-white animate-pulse' :
                        'bg-cream-200 text-cream-400'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : status === 'current' ? (
                          <Icon className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-xs text-cream-600 mt-1 text-center">{step.name.split('')[0]}</p>
                    </div>
                    {index < stepConfig.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${
                        getStepStatus(stepConfig[index + 1].key) !== 'pending' 
                          ? 'bg-green-500' 
                          : 'bg-cream-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stepConfig.map((step) => {
              const status = getStepStatus(step.key);
              const Icon = step.icon;
              return (
                <div 
                  key={step.key}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    status === 'completed' ? 'border-green-300 bg-green-50' :
                    status === 'current' ? 'border-primary-300 bg-primary-50' :
                    'border-cream-200 bg-cream-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[step.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-cream-900">{step.name}</h4>
                        {status === 'completed' && (
                          <span className="status-badge status-normal">已完成</span>
                        )}
                        {status === 'current' && (
                          <span className="status-badge status-warning">进行中</span>
                        )}
                        {status === 'pending' && (
                          <span className="status-badge status-alert">待开始</span>
                        )}
                      </div>
                      <p className="text-xs text-cream-500">
                        {PROCESS_STEPS.find(s => s.name === step.name)?.description}
                      </p>
                    </div>
                  </div>
                  
                  {status !== 'pending' && (
                    <div className="mt-3 pt-3 border-t border-cream-200">
                      {renderRecord(step.key as keyof BatchHistory)}
                    </div>
                  )}
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
                完成度: <span className="font-semibold text-primary-600">
                  {Math.round((selectedBatch.currentStep / 7) * 100)}%
                </span>
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
