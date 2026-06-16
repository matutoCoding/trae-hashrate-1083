import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Bug, Clock, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { ModuleHeader } from '../components/ui/ModuleHeader';
import { useAppStore } from '../store/useAppStore';
import { CultivationRecord } from '../types';
import { TemperatureHumidityChart } from '../components/Charts/TemperatureHumidityChart';

export function Cultivation() {
  const { cultivationRecords, batches, temperatureHumidityData, addCultivationRecord, updateBatchStatus, updateTemperatureHumidity } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batchId: '',
    moldStrain: 'AS3.2778',
    inoculationAmount: 1.5,
    temperature: 22,
    humidity: 85,
    cultivationDays: 1,
    myceliumStatus: '接种完成',
    notes: '',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      updateTemperatureHumidity();
    }, 300000);
    return () => clearInterval(timer);
  }, [updateTemperatureHumidity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCultivationRecord(formData);
    if (formData.batchId && formData.cultivationDays >= 3) {
      updateBatchStatus(formData.batchId, 'bottling', 4);
    }
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batchId' || name === 'moldStrain' || name === 'myceliumStatus' || name === 'notes' 
        ? value 
        : Number(value) || value,
    }));
  };

  const getBatchNumber = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch?.batchNumber || '-';
  };

  const latestData = temperatureHumidityData[temperatureHumidityData.length - 1];
  const isTempNormal = latestData?.temperature >= 20 && latestData?.temperature <= 25;
  const isHumidityNormal = latestData?.humidity >= 80 && latestData?.humidity <= 90;

  return (
    <div>
      <ModuleHeader
        title="前期培菌"
        description="毛霉接种培菌、菌丝生长温湿度控制"
        icon={Thermometer}
        currentStep={3}
        showAddButton
        onAddClick={() => setShowForm(true)}
        addButtonText="新增培菌记录"
      />

      {showForm && (
        <div className="fixed inset-0 bg-cream-900/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-cream-900">新增培菌记录</h2>
              <button onClick={() => setShowForm(false)} className="text-cream-500 hover:text-cream-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label-text">选择批次</label>
                <select name="batchId" value={formData.batchId} onChange={handleInputChange} className="input-field" required>
                  <option value="">请选择生产批次</option>
                  {batches.filter(b => b.status === 'cultivation').map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.batchNumber}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text"><Bug className="w-4 h-4 inline mr-1" /> 毛霉菌株</label>
                  <select name="moldStrain" value={formData.moldStrain} onChange={handleInputChange} className="input-field">
                    <option value="AS3.2778">AS3.2778 (鲁氏毛霉)</option>
                    <option value="AS3.3452">AS3.3452 (总状毛霉)</option>
                    <option value="AS3.2506">AS3.2506 (米根霉)</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">接种量 (%)</label>
                  <input type="number" step="0.1" name="inoculationAmount" value={formData.inoculationAmount} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text"><Thermometer className="w-4 h-4 inline mr-1" /> 培菌温度 (°C)</label>
                  <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="label-text"><Droplets className="w-4 h-4 inline mr-1" /> 培菌湿度 (%)</label>
                  <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text"><Clock className="w-4 h-4 inline mr-1" /> 培菌天数</label>
                  <input type="number" name="cultivationDays" value={formData.cultivationDays} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="label-text">菌丝状态</label>
                  <select name="myceliumStatus" value={formData.myceliumStatus} onChange={handleInputChange} className="input-field">
                    <option value="接种完成">接种完成</option>
                    <option value="孢子萌发">孢子萌发</option>
                    <option value="菌丝生长">菌丝生长</option>
                    <option value="菌丝浓密">菌丝浓密</option>
                    <option value="菌丝成熟">菌丝成熟</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-text"><FileText className="w-4 h-4 inline mr-1" /> 备注</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input-field h-24 resize-none" placeholder="记录菌丝生长情况..." />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">取消</button>
                <button type="submit" className="btn-primary"><CheckCircle className="w-4 h-4 inline mr-2" />保存记录</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`card opacity-0 animate-stagger-1 ${!isTempNormal ? 'ring-2 ring-fermentation-alert' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cream-600 mb-1">当前温度</p>
              <p className="text-3xl font-bold text-cream-900 font-serif">{latestData?.temperature}°C</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isTempNormal ? 'bg-fermentation-normal/10' : 'bg-fermentation-alert/10'}`}>
              {isTempNormal ? <Thermometer className="w-6 h-6 text-fermentation-normal" /> : <AlertTriangle className="w-6 h-6 text-fermentation-alert animate-pulse" />}
            </div>
          </div>
          <p className={`text-xs mt-2 ${isTempNormal ? 'text-fermentation-normal' : 'text-fermentation-alert'}`}>
            {isTempNormal ? '温度适宜 (20-25°C)' : '温度异常，请注意调节'}
          </p>
        </div>

        <div className={`card opacity-0 animate-stagger-2 ${!isHumidityNormal ? 'ring-2 ring-fermentation-alert' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cream-600 mb-1">当前湿度</p>
              <p className="text-3xl font-bold text-cream-900 font-serif">{latestData?.humidity}%</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isHumidityNormal ? 'bg-fermentation-normal/10' : 'bg-fermentation-alert/10'}`}>
              {isHumidityNormal ? <Droplets className="w-6 h-6 text-fermentation-normal" /> : <AlertTriangle className="w-6 h-6 text-fermentation-alert animate-pulse" />}
            </div>
          </div>
          <p className={`text-xs mt-2 ${isHumidityNormal ? 'text-fermentation-normal' : 'text-fermentation-alert'}`}>
            {isHumidityNormal ? '湿度适宜 (80-90%)' : '湿度异常，请注意调节'}
          </p>
        </div>

        <div className="card opacity-0 animate-stagger-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cream-600 mb-1">进行中批次</p>
              <p className="text-3xl font-bold text-cream-900 font-serif">{batches.filter(b => b.status === 'cultivation').length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Bug className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs mt-2 text-amber-600">培菌周期: 3-5天</p>
        </div>
      </div>

      <div className="mb-6">
        <TemperatureHumidityChart data={temperatureHumidityData} title="培菌室温湿度实时监控" showGauge={false} />
      </div>

      <div className="card opacity-0 animate-stagger-4">
        <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">培菌记录</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">批次号</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">菌株</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">温度(°C)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">湿度(%)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">天数</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">菌丝状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">记录时间</th>
              </tr>
            </thead>
            <tbody>
              {cultivationRecords.map((record: CultivationRecord, index: number) => (
                <tr key={record.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4"><span className="font-mono text-sm">{getBatchNumber(record.batchId)}</span></td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.moldStrain}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.temperature}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.humidity}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{record.cultivationDays}天</td>
                  <td className="py-3 px-4">
                    <span className={`status-badge ${
                      record.myceliumStatus === '菌丝成熟' ? 'status-normal' :
                      record.myceliumStatus === '菌丝浓密' ? 'status-warning' : 'status-alert'
                    }`}>{record.myceliumStatus}</span>
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
