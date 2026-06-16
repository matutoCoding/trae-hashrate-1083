import { useState, useEffect } from 'react';
import { FlaskConical, Droplets, Clock, Soup, FileText, CheckCircle, Star } from 'lucide-react';
import { ModuleHeader } from '../components/ui/ModuleHeader';
import { useAppStore } from '../store/useAppStore';
import { BottlingRecord } from '../types';

export function Bottling() {
  const { bottlingRecords, batches, selectedBatch, addBottlingRecord, updateBatchStatus } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batchId: '',
    rubbingQuality: '良好',
    saltAmount: 45,
    marinatingTime: 48,
    soupFormula: '红方经典配方',
    jarCount: 500,
    notes: '',
  });

  useEffect(() => {
    if (selectedBatch && selectedBatch.status === 'bottling') {
      setFormData(prev => ({ ...prev, batchId: selectedBatch.id }));
      setShowForm(true);
    }
  }, [selectedBatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBottlingRecord(formData);
    if (formData.batchId) {
      updateBatchStatus(formData.batchId, 'fermentation', 5);
    }
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batchId' || name === 'rubbingQuality' || name === 'soupFormula' || name === 'notes' 
        ? value 
        : Number(value) || value,
    }));
  };

  const getBatchNumber = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch?.batchNumber || '-';
  };

  const renderStars = (quality: string) => {
    const count = quality === '优秀' ? 5 : quality === '良好' ? 4 : quality === '一般' ? 3 : 2;
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < count ? 'text-amber-500 fill-amber-500' : 'text-cream-300'}`} />
    ));
  };

  return (
    <div>
      <ModuleHeader
        title="搓毛装坛"
        description="搓毛腌坯管理、加料汤装坛记录"
        icon={FlaskConical}
        currentStep={4}
        showAddButton
        onAddClick={() => setShowForm(true)}
        addButtonText="新增装坛记录"
      />

      {showForm && (
        <div className="fixed inset-0 bg-cream-900/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-cream-900">新增搓毛装坛记录</h2>
              <button onClick={() => setShowForm(false)} className="text-cream-500 hover:text-cream-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-text">选择批次</label>
                <select name="batchId" value={formData.batchId} onChange={handleInputChange} className="input-field" required>
                  <option value="">请选择生产批次</option>
                  {batches.filter(b => b.status === 'bottling').map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.batchNumber}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">搓毛质量</label>
                  <select name="rubbingQuality" value={formData.rubbingQuality} onChange={handleInputChange} className="input-field">
                    <option value="优秀">优秀 (5星)</option>
                    <option value="良好">良好 (4星)</option>
                    <option value="一般">一般 (3星)</option>
                    <option value="较差">较差 (2星)</option>
                  </select>
                </div>
                <div>
                  <label className="label-text"><Droplets className="w-4 h-4 inline mr-1" /> 食盐用量 (kg)</label>
                  <input type="number" name="saltAmount" value={formData.saltAmount} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text"><Clock className="w-4 h-4 inline mr-1" /> 腌坯时间 (小时)</label>
                  <input type="number" name="marinatingTime" value={formData.marinatingTime} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="label-text">装坛数量 (坛)</label>
                  <input type="number" name="jarCount" value={formData.jarCount} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div>
                <label className="label-text"><Soup className="w-4 h-4 inline mr-1" /> 料汤配方</label>
                <select name="soupFormula" value={formData.soupFormula} onChange={handleInputChange} className="input-field">
                  <option value="红方经典配方">红方经典配方</option>
                  <option value="红方香辣配方">红方香辣配方</option>
                  <option value="青方专用配方">青方专用配方</option>
                  <option value="白方清淡配方">白方清淡配方</option>
                </select>
              </div>

              <div>
                <label className="label-text"><FileText className="w-4 h-4 inline mr-1" /> 备注</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input-field h-24 resize-none" placeholder="记录搓毛和装坛情况..." />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">取消</button>
                <button type="submit" className="btn-primary"><CheckCircle className="w-4 h-4 inline mr-2" />保存记录</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card opacity-0 animate-stagger-1">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">料汤配方标准</h3>
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
              <h4 className="font-medium text-primary-700 mb-2">红方经典配方</h4>
              <div className="text-sm text-cream-700 space-y-1">
                <p>• 黄酒: 500ml</p>
                <p>• 酱油: 300ml</p>
                <p>• 冰糖: 100g</p>
                <p>• 八角、桂皮、花椒: 适量</p>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-700 mb-2">青方专用配方</h4>
              <div className="text-sm text-cream-700 space-y-1">
                <p>• 盐水: 800ml (浓度12%)</p>
                <p>• 花椒: 20g</p>
                <p>• 黄酒: 100ml</p>
                <p>• 发酵时间: 6个月以上</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card opacity-0 animate-stagger-2">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">工艺参数标准</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><Star className="w-5 h-5 text-primary-600" /></div>
                <div><p className="text-sm text-cream-600">搓毛质量</p><p className="text-lg font-bold text-cream-900">≥ 4星</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Droplets className="w-5 h-5 text-amber-600" /></div>
                <div><p className="text-sm text-cream-600">用盐比例</p><p className="text-lg font-bold text-cream-900">12-15%</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Clock className="w-5 h-5 text-green-600" /></div>
                <div><p className="text-sm text-cream-600">腌坯时间</p><p className="text-lg font-bold text-cream-900">48-72小时</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card opacity-0 animate-stagger-3">
        <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">搓毛装坛记录</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">批次号</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">搓毛质量</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">食盐(kg)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">腌坯(小时)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">料汤配方</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">装坛数</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">记录时间</th>
              </tr>
            </thead>
            <tbody>
              {bottlingRecords.map((record: BottlingRecord, index: number) => (
                <tr key={record.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4"><span className="font-mono text-sm">{getBatchNumber(record.batchId)}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {renderStars(record.rubbingQuality)}
                      <span className="ml-2 text-sm text-cream-700">{record.rubbingQuality}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.saltAmount}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.marinatingTime}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.soupFormula}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.jarCount}坛</td>
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
