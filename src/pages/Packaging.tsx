import { useState } from 'react';
import { Package, Droplets, Tag, CheckCircle, FileText, ClipboardCheck } from 'lucide-react';
import { ModuleHeader } from '../components/ui/ModuleHeader';
import { useAppStore } from '../store/useAppStore';
import { PackagingRecord } from '../types';

export function Packaging() {
  const { packagingRecords, batches, addPackagingRecord, updateBatchStatus } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batchId: '',
    bottleCount: 1400,
    soupStandard: '红方标准',
    sealingQuality: '全部合格',
    labelType: '传统红方标签',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPackagingRecord(formData);
    if (formData.batchId) {
      updateBatchStatus(formData.batchId, 'completed', 7);
    }
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batchId' || name === 'soupStandard' || name === 'sealingQuality' || name === 'labelType' || name === 'notes' 
        ? value 
        : Number(value) || value,
    }));
  };

  const getBatchNumber = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch?.batchNumber || '-';
  };

  const packagingSteps = [
    { name: '装瓶', icon: '🍶', status: 'completed' },
    { name: '灌汤', icon: '🥣', status: 'completed' },
    { name: '封口', icon: '🔒', status: 'current' },
    { name: '贴标', icon: '🏷️', status: 'pending' },
    { name: '检验', icon: '✅', status: 'pending' },
  ];

  const getQualityColor = (quality: string) => {
    if (quality === '全部合格') return 'status-normal';
    if (quality === '抽检合格') return 'status-warning';
    return 'status-alert';
  };

  return (
    <div>
      <ModuleHeader
        title="装瓶贴标"
        description="装瓶灌汤封口、标签管理"
        icon={Package}
        currentStep={6}
        showAddButton
        onAddClick={() => setShowForm(true)}
        addButtonText="新增包装记录"
      />

      {showForm && (
        <div className="fixed inset-0 bg-cream-900/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-cream-900">新增装瓶贴标记录</h2>
              <button onClick={() => setShowForm(false)} className="text-cream-500 hover:text-cream-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-text">选择批次</label>
                <select name="batchId" value={formData.batchId} onChange={handleInputChange} className="input-field" required>
                  <option value="">请选择生产批次</option>
                  {batches.filter(b => b.status === 'packaging').map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.batchNumber}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text"><Package className="w-4 h-4 inline mr-1" /> 装瓶数量 (瓶)</label>
                  <input type="number" name="bottleCount" value={formData.bottleCount} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="label-text"><Droplets className="w-4 h-4 inline mr-1" /> 灌汤标准</label>
                  <select name="soupStandard" value={formData.soupStandard} onChange={handleInputChange} className="input-field">
                    <option value="红方标准">红方标准</option>
                    <option value="红方香辣">红方香辣</option>
                    <option value="青方标准">青方标准</option>
                    <option value="白方标准">白方标准</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text"><ClipboardCheck className="w-4 h-4 inline mr-1" /> 封口质量</label>
                  <select name="sealingQuality" value={formData.sealingQuality} onChange={handleInputChange} className="input-field">
                    <option value="全部合格">全部合格</option>
                    <option value="抽检合格">抽检合格</option>
                    <option value="需返工">需返工</option>
                  </select>
                </div>
                <div>
                  <label className="label-text"><Tag className="w-4 h-4 inline mr-1" /> 标签类型</label>
                  <select name="labelType" value={formData.labelType} onChange={handleInputChange} className="input-field">
                    <option value="传统红方标签">传统红方标签</option>
                    <option value="香辣红方标签">香辣红方标签</option>
                    <option value="青方臭豆腐标签">青方臭豆腐标签</option>
                    <option value="白方清淡标签">白方清淡标签</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-text"><FileText className="w-4 h-4 inline mr-1" /> 备注</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input-field h-24 resize-none" placeholder="记录包装情况..." />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">取消</button>
                <button type="submit" className="btn-primary"><CheckCircle className="w-4 h-4 inline mr-2" />保存记录</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card opacity-0 animate-stagger-1 mb-6">
        <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">包装工艺流程</h3>
        <div className="flex items-center justify-between">
          {packagingSteps.map((step, index) => (
            <div key={index} className="flex-1 text-center relative">
              {index < packagingSteps.length - 1 && (
                <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                  step.status === 'completed' ? 'bg-fermentation-normal' : 'bg-cream-200'
                }`} />
              )}
              <div className={`relative w-8 h-8 rounded-full mx-auto flex items-center justify-center text-lg ${
                step.status === 'completed' ? 'bg-fermentation-normal text-white' :
                step.status === 'current' ? 'bg-primary-600 text-white ring-4 ring-primary-100 animate-breathing' : 'bg-cream-200'
              }`}>
                {step.icon}
              </div>
              <p className={`text-sm mt-2 font-medium ${
                step.status === 'completed' ? 'text-fermentation-normal' :
                step.status === 'current' ? 'text-primary-600' : 'text-cream-500'
              }`}>{step.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card opacity-0 animate-stagger-2">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">包装规格标准</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><Package className="w-5 h-5 text-primary-600" /></div>
                <div><p className="text-sm text-cream-600">瓶装规格</p><p className="text-lg font-bold text-cream-900">280g/瓶</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Droplets className="w-5 h-5 text-amber-600" /></div>
                <div><p className="text-sm text-cream-600">灌汤量</p><p className="text-lg font-bold text-cream-900">50-60ml</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Tag className="w-5 h-5 text-green-600" /></div>
                <div><p className="text-sm text-cream-600">标签尺寸</p><p className="text-lg font-bold text-cream-900">8x5cm</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
          </div>
        </div>

        <div className="card opacity-0 animate-stagger-3">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">质量检验标准</h3>
          <div className="space-y-3">
            <div className="p-3 bg-cream-50 rounded-lg border border-cream-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-fermentation-normal" />
                <span className="font-medium text-cream-800">外观检查</span>
              </div>
              <p className="text-sm text-cream-600">瓶身清洁无污渍，标签平整无皱褶</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-lg border border-cream-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-fermentation-normal" />
                <span className="font-medium text-cream-800">密封性检查</span>
              </div>
              <p className="text-sm text-cream-600">瓶盖拧紧无松动，倒置无渗漏</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-lg border border-cream-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-fermentation-normal" />
                <span className="font-medium text-cream-800">净含量检查</span>
              </div>
              <p className="text-sm text-cream-600">每瓶净含量280g，允许误差±5%</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-lg border border-cream-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-fermentation-normal" />
                <span className="font-medium text-cream-800">标签信息</span>
              </div>
              <p className="text-sm text-cream-600">生产日期、保质期、配料表完整清晰</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card opacity-0 animate-stagger-4">
        <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">包装记录</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">批次号</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">装瓶数量</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">灌汤标准</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">封口质量</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">标签类型</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">记录时间</th>
              </tr>
            </thead>
            <tbody>
              {packagingRecords.map((record: PackagingRecord, index: number) => (
                <tr key={record.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4"><span className="font-mono text-sm">{getBatchNumber(record.batchId)}</span></td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.bottleCount.toLocaleString()}瓶</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.soupStandard}</td>
                  <td className="py-3 px-4">
                    <span className={`status-badge ${getQualityColor(record.sealingQuality)}`}>
                      {record.sealingQuality}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.labelType}</td>
                  <td className="py-3 px-4 text-sm text-cream-500">{record.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
