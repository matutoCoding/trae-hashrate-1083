import { useState } from 'react';
import { Flame, Droplets, ThermometerSun, Clock, FileText, CheckCircle, Plus } from 'lucide-react';
import { ModuleHeader } from '../components/ui/ModuleHeader';
import { useAppStore } from '../store/useAppStore';
import { GrindingRecord } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Grinding() {
  const { grindingRecords, batches, addGrindingRecord, updateBatchStatus } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batchId: '',
    soybeanAmount: 500,
    waterAmount: 1500,
    cookingTemp: 98,
    cookingTime: 45,
    coagulantType: '卤水',
    coagulantAmount: 25,
    solidificationStatus: '良好',
    notes: '',
  });

  const cookingTempData = [
    { time: '0分钟', temp: 25 },
    { time: '5分钟', temp: 45 },
    { time: '10分钟', temp: 65 },
    { time: '15分钟', temp: 80 },
    { time: '20分钟', temp: 90 },
    { time: '25分钟', temp: 95 },
    { time: '30分钟', temp: 98 },
    { time: '35分钟', temp: 98 },
    { time: '40分钟', temp: 98 },
    { time: '45分钟', temp: 97 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGrindingRecord(formData);
    if (formData.batchId) {
      updateBatchStatus(formData.batchId, 'pressing', 2);
    }
    setShowForm(false);
    setFormData({
      batchId: '',
      soybeanAmount: 500,
      waterAmount: 1500,
      cookingTemp: 98,
      cookingTime: 45,
      coagulantType: '卤水',
      coagulantAmount: 25,
      solidificationStatus: '良好',
      notes: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batchId' ? value : Number(value) || value,
    }));
  };

  const getBatchNumber = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch?.batchNumber || '-';
  };

  return (
    <div>
      <ModuleHeader
        title="磨浆点卤"
        description="黄豆磨浆煮浆、点卤凝固参数管理"
        icon={Flame}
        currentStep={1}
        showAddButton
        onAddClick={() => setShowForm(true)}
        addButtonText="新增磨浆记录"
      />

      {showForm && (
        <div className="fixed inset-0 bg-cream-900/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-cream-900">新增磨浆点卤记录</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-cream-500 hover:text-cream-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-text">选择批次</label>
                <select 
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">请选择生产批次</option>
                  {batches.filter(b => b.status === 'grinding').map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchNumber} - {batch.productType === 'red' ? '红方' : batch.productType === 'green' ? '青方' : '白方'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">
                    <Droplets className="w-4 h-4 inline mr-1" />
                    黄豆用量 (kg)
                  </label>
                  <input
                    type="number"
                    name="soybeanAmount"
                    value={formData.soybeanAmount}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">
                    <Droplets className="w-4 h-4 inline mr-1" />
                    用水量 (L)
                  </label>
                  <input
                    type="number"
                    name="waterAmount"
                    value={formData.waterAmount}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">
                    <ThermometerSun className="w-4 h-4 inline mr-1" />
                    煮浆温度 (°C)
                  </label>
                  <input
                    type="number"
                    name="cookingTemp"
                    value={formData.cookingTemp}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">
                    <Clock className="w-4 h-4 inline mr-1" />
                    煮浆时间 (分钟)
                  </label>
                  <input
                    type="number"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">凝固剂类型</label>
                  <select 
                    name="coagulantType"
                    value={formData.coagulantType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="卤水">卤水 (盐卤)</option>
                    <option value="石膏">石膏</option>
                    <option value="葡萄糖内酯">葡萄糖内酯</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">凝固剂用量 (g)</label>
                  <input
                    type="number"
                    name="coagulantAmount"
                    value={formData.coagulantAmount}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label-text">凝固状态</label>
                <select 
                  name="solidificationStatus"
                  value={formData.solidificationStatus}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="优秀">优秀</option>
                  <option value="良好">良好</option>
                  <option value="一般">一般</option>
                  <option value="较差">较差</option>
                </select>
              </div>

              <div>
                <label className="label-text">
                  <FileText className="w-4 h-4 inline mr-1" />
                  备注
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="input-field h-24 resize-none"
                  placeholder="记录工艺要点和观察..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="btn-outline"
                >
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  保存记录
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card opacity-0 animate-stagger-1">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">煮浆温度曲线</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cookingTempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />
                <XAxis dataKey="time" stroke="#7D5A4F" fontSize={12} />
                <YAxis stroke="#7D5A4F" fontSize={12} domain={[0, 110]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FDF5E6', 
                    border: '1px solid #C4A57B',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value}°C`, '温度']}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#C62828" 
                  strokeWidth={2}
                  dot={{ fill: '#C62828', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card opacity-0 animate-stagger-2">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">工艺参数标准</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-cream-600">豆水比例</p>
                  <p className="text-lg font-bold text-cream-900">1 : 3</p>
                </div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <ThermometerSun className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-cream-600">煮浆温度</p>
                  <p className="text-lg font-bold text-cream-900">95-100°C</p>
                </div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-cream-600">煮浆时间</p>
                  <p className="text-lg font-bold text-cream-900">40-50分钟</p>
                </div>
              </div>
              <span className="status-badge status-normal">标准</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card opacity-0 animate-stagger-3">
        <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">磨浆点卤记录</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">批次号</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">黄豆(kg)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">用水(L)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">温度(°C)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">时间(分)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">凝固剂</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">记录时间</th>
              </tr>
            </thead>
            <tbody>
              {grindingRecords.map((record: GrindingRecord, index: number) => (
                <tr key={record.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm">{getBatchNumber(record.batchId)}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.soybeanAmount}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.waterAmount}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.cookingTemp}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.cookingTime}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.coagulantType}</td>
                  <td className="py-3 px-4">
                    <span className={`status-badge ${
                      record.solidificationStatus === '优秀' ? 'status-normal' : 
                      record.solidificationStatus === '良好' ? 'status-warning' : 'status-alert'
                    }`}>
                      {record.solidificationStatus}
                    </span>
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
