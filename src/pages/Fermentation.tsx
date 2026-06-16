import { useState, useEffect } from 'react';
import { Clock, Droplets, Thermometer, FileText, CheckCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ModuleHeader } from '../components/ui/ModuleHeader';
import { useAppStore } from '../store/useAppStore';
import { FermentationRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Fermentation() {
  const { fermentationRecords, batches, selectedBatch, addFermentationRecord, updateBatchStatus } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'red' | 'green'>('red');
  const [formData, setFormData] = useState({
    batchId: '',
    flavorType: '红方',
    seasoningFormula: '红方传统配方',
    fermentationTemp: 25,
    fermentationDays: 30,
    maturityLevel: '30%',
    notes: '',
  });

  useEffect(() => {
    if (selectedBatch && selectedBatch.status === 'fermentation') {
      setFormData(prev => ({ 
        ...prev, 
        batchId: selectedBatch.id,
        flavorType: selectedBatch.productType === 'green' ? '青方' : '红方',
        seasoningFormula: selectedBatch.productType === 'green' ? '青方臭豆腐配方' : '红方传统配方',
      }));
      setSelectedType(selectedBatch.productType === 'green' ? 'green' : 'red');
      setShowForm(true);
    }
  }, [selectedBatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFermentationRecord(formData);
    if (formData.batchId && formData.maturityLevel === '100%') {
      updateBatchStatus(formData.batchId, 'packaging', 6);
    }
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batchId' || name === 'flavorType' || name === 'seasoningFormula' || name === 'maturityLevel' || name === 'notes' 
        ? value 
        : Number(value) || value,
    }));
  };

  const getBatchNumber = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch?.batchNumber || '-';
  };

  const fermentationTimeline = [
    { phase: '第1周', progress: 25, description: '前期发酵' },
    { phase: '第2周', progress: 50, description: '中期发酵' },
    { phase: '第3周', progress: 75, description: '后期发酵' },
    { phase: '第4周+', progress: 100, description: '成熟稳定' },
  ];

  const getMaturityColor = (level: string) => {
    const num = parseInt(level);
    if (num >= 90) return 'bg-fermentation-normal';
    if (num >= 60) return 'bg-amber-500';
    return 'bg-primary-500';
  };

  return (
    <div>
      <ModuleHeader
        title="后期发酵"
        description="红方青方调味配置、后发酵成熟监控"
        icon={Clock}
        currentStep={5}
        showAddButton
        onAddClick={() => setShowForm(true)}
        addButtonText="新增发酵记录"
      />

      {showForm && (
        <div className="fixed inset-0 bg-cream-900/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-cream-900">新增发酵记录</h2>
              <button onClick={() => setShowForm(false)} className="text-cream-500 hover:text-cream-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => { setSelectedType('red'); setFormData(p => ({ ...p, flavorType: '红方', seasoningFormula: '红方传统配方' })); }}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    selectedType === 'red' 
                      ? 'bg-primary-600 text-white shadow-lg' 
                      : 'bg-cream-100 text-cream-700 hover:bg-cream-200'
                  }`}
                >
                  红方腐乳
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedType('green'); setFormData(p => ({ ...p, flavorType: '青方', seasoningFormula: '青方臭豆腐配方' })); }}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    selectedType === 'green' 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-cream-100 text-cream-700 hover:bg-cream-200'
                  }`}
                >
                  青方腐乳
                </button>
              </div>

              <div>
                <label className="label-text">选择批次</label>
                <select name="batchId" value={formData.batchId} onChange={handleInputChange} className="input-field" required>
                  <option value="">请选择生产批次</option>
                  {batches.filter(b => b.status === 'fermentation').map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.batchNumber}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">调味配方</label>
                  <select name="seasoningFormula" value={formData.seasoningFormula} onChange={handleInputChange} className="input-field">
                    {selectedType === 'red' ? (
                      <>
                        <option value="红方传统配方">红方传统配方</option>
                        <option value="红方香辣配方">红方香辣配方</option>
                        <option value="红方玫瑰配方">红方玫瑰配方</option>
                      </>
                    ) : (
                      <>
                        <option value="青方臭豆腐配方">青方臭豆腐配方</option>
                        <option value="青方清淡配方">青方清淡配方</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="label-text"><Thermometer className="w-4 h-4 inline mr-1" /> 发酵温度 (°C)</label>
                  <input type="number" step="0.1" name="fermentationTemp" value={formData.fermentationTemp} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text"><Clock className="w-4 h-4 inline mr-1" /> 发酵天数</label>
                  <input type="number" name="fermentationDays" value={formData.fermentationDays} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="label-text">成熟度</label>
                  <select name="maturityLevel" value={formData.maturityLevel} onChange={handleInputChange} className="input-field">
                    <option value="10%">10% - 发酵初期</option>
                    <option value="30%">30% - 前期发酵</option>
                    <option value="50%">50% - 中期发酵</option>
                    <option value="70%">70% - 后期发酵</option>
                    <option value="90%">90% - 接近成熟</option>
                    <option value="100%">100% - 完全成熟</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-text"><FileText className="w-4 h-4 inline mr-1" /> 备注</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input-field h-24 resize-none" placeholder="记录发酵状态和观察..." />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">取消</button>
                <button type="submit" className="btn-primary"><CheckCircle className="w-4 h-4 inline mr-2" />保存记录</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {fermentationTimeline.map((item, index) => (
          <div key={index} className="card opacity-0 animate-stagger-1" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                item.progress === 100 ? 'bg-fermentation-normal text-white' :
                item.progress >= 50 ? 'bg-amber-500 text-white' : 'bg-primary-100 text-primary-600'
              }`}>
                {item.progress === 100 ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
              </div>
              <h4 className="font-medium text-cream-900">{item.phase}</h4>
              <p className="text-sm text-cream-600">{item.description}</p>
              <div className="mt-2 h-2 bg-cream-200 rounded-full overflow-hidden">
                <div className={`h-full ${getMaturityColor(item.progress + '%')} rounded-full transition-all duration-500`} style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card opacity-0 animate-stagger-4">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">各批次发酵进度</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'FR2026061401', 成熟度: 70 },
                { name: 'FR2026061301', 成熟度: 100 },
                { name: 'FR2026061501', 成熟度: 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />
                <XAxis dataKey="name" stroke="#7D5A4F" fontSize={11} />
                <YAxis stroke="#7D5A4F" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FDF5E6', border: '1px solid #C4A57B', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value}%`, '成熟度']}
                />
                <Bar dataKey="成熟度" fill="#8B0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card opacity-0 animate-stagger-5">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">发酵环境标准</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><Thermometer className="w-5 h-5 text-primary-600" /></div>
                <div><p className="text-sm text-cream-600">发酵温度</p><p className="text-lg font-bold text-cream-900">20-28°C</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Droplets className="w-5 h-5 text-amber-600" /></div>
                <div><p className="text-sm text-cream-600">环境湿度</p><p className="text-lg font-bold text-cream-900">70-80%</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Clock className="w-5 h-5 text-green-600" /></div>
                <div><p className="text-sm text-cream-600">发酵周期</p><p className="text-lg font-bold text-cream-900">30-180天</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-blue-600" /></div>
                <div><p className="text-sm text-cream-600">通风条件</p><p className="text-lg font-bold text-cream-900">阴凉通风</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card opacity-0 animate-stagger-6">
        <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">发酵记录</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">批次号</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">类型</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">配方</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">温度(°C)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">天数</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">成熟度</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">记录时间</th>
              </tr>
            </thead>
            <tbody>
              {fermentationRecords.map((record: FermentationRecord, index: number) => (
                <tr key={record.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4"><span className="font-mono text-sm">{getBatchNumber(record.batchId)}</span></td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      record.flavorType === '红方' ? 'bg-primary-100 text-primary-700' : 'bg-green-100 text-green-700'
                    }`}>{record.flavorType}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.seasoningFormula}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.fermentationTemp}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.fermentationDays}天</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-cream-200 rounded-full overflow-hidden">
                        <div className={`h-full ${getMaturityColor(record.maturityLevel)} rounded-full`} style={{ width: record.maturityLevel }} />
                      </div>
                      <span className="text-sm font-medium text-cream-700">{record.maturityLevel}</span>
                    </div>
                  </td>
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
