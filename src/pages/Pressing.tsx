import { useState } from 'react';
import { Box, Gauge, Clock, Grid3X3, FileText, CheckCircle } from 'lucide-react';
import { ModuleHeader } from '../components/ui/ModuleHeader';
import { useAppStore } from '../store/useAppStore';
import { PressingRecord } from '../types';

export function Pressing() {
  const { pressingRecords, batches, addPressingRecord, updateBatchStatus } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batchId: '',
    pressure: 80,
    pressingTime: 180,
    blankSize: '4x4x2cm',
    blankCount: 2500,
    arrangementPattern: '5x8网格',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPressingRecord(formData);
    if (formData.batchId) {
      updateBatchStatus(formData.batchId, 'cultivation', 3);
    }
    setShowForm(false);
    setFormData({
      batchId: '',
      pressure: 80,
      pressingTime: 180,
      blankSize: '4x4x2cm',
      blankCount: 2500,
      arrangementPattern: '5x8网格',
      notes: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batchId' || name === 'blankSize' || name === 'arrangementPattern' || name === 'notes' 
        ? value 
        : Number(value) || value,
    }));
  };

  const getBatchNumber = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch?.batchNumber || '-';
  };

  const arrangementGrid = Array(40).fill(0);

  return (
    <div>
      <ModuleHeader
        title="压坯划块"
        description="压榨成坯监控、白坯切块摆笼管理"
        icon={Box}
        currentStep={2}
        showAddButton
        onAddClick={() => setShowForm(true)}
        addButtonText="新增压榨记录"
      />

      {showForm && (
        <div className="fixed inset-0 bg-cream-900/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-cream-900">新增压坯划块记录</h2>
              <button onClick={() => setShowForm(false)} className="text-cream-500 hover:text-cream-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-text">选择批次</label>
                <select name="batchId" value={formData.batchId} onChange={handleInputChange} className="input-field" required>
                  <option value="">请选择生产批次</option>
                  {batches.filter(b => b.status === 'pressing').map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.batchNumber}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text"><Gauge className="w-4 h-4 inline mr-1" /> 压榨压力 (kg)</label>
                  <input type="number" name="pressure" value={formData.pressure} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="label-text"><Clock className="w-4 h-4 inline mr-1" /> 压榨时间 (分钟)</label>
                  <input type="number" name="pressingTime" value={formData.pressingTime} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">白坯规格</label>
                  <select name="blankSize" value={formData.blankSize} onChange={handleInputChange} className="input-field">
                    <option value="3x3x2cm">3x3x2cm (小块)</option>
                    <option value="4x4x2cm">4x4x2cm (标准)</option>
                    <option value="5x5x2.5cm">5x5x2.5cm (大块)</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">切块数量 (块)</label>
                  <input type="number" name="blankCount" value={formData.blankCount} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div>
                <label className="label-text"><Grid3X3 className="w-4 h-4 inline mr-1" /> 摆笼方式</label>
                <select name="arrangementPattern" value={formData.arrangementPattern} onChange={handleInputChange} className="input-field">
                  <option value="4x6网格">4x6网格 (24块/笼)</option>
                  <option value="5x8网格">5x8网格 (40块/笼)</option>
                  <option value="6x8网格">6x8网格 (48块/笼)</option>
                </select>
              </div>

              <div>
                <label className="label-text"><FileText className="w-4 h-4 inline mr-1" /> 备注</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input-field h-24 resize-none" placeholder="记录压榨情况和观察..." />
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
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">摆笼布局示意</h3>
          <div className="bg-cream-100 p-4 rounded-lg">
            <div className="grid grid-cols-8 gap-1">
              {arrangementGrid.map((_, i) => (
                <div key={i} className="aspect-square bg-primary-100 border border-primary-200 rounded-sm flex items-center justify-center text-xs text-primary-700">
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-cream-600 mt-3">5x8 网格布局 · 每笼40块</p>
          </div>
        </div>

        <div className="card opacity-0 animate-stagger-2">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">工艺参数标准</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><Gauge className="w-5 h-5 text-primary-600" /></div>
                <div><p className="text-sm text-cream-600">压榨压力</p><p className="text-lg font-bold text-cream-900">70-90 kg</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>
                <div><p className="text-sm text-cream-600">压榨时间</p><p className="text-lg font-bold text-cream-900">150-200分钟</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Box className="w-5 h-5 text-green-600" /></div>
                <div><p className="text-sm text-cream-600">白坯标准</p><p className="text-lg font-bold text-cream-900">4x4x2cm</p></div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card opacity-0 animate-stagger-3">
        <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">压坯划块记录</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">批次号</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">压力(kg)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">时间(分)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">白坯规格</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">切块数量</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">摆笼方式</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">记录时间</th>
              </tr>
            </thead>
            <tbody>
              {pressingRecords.map((record: PressingRecord, index: number) => (
                <tr key={record.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4"><span className="font-mono text-sm">{getBatchNumber(record.batchId)}</span></td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.pressure}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.pressingTime}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.blankSize}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.blankCount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.arrangementPattern}</td>
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
