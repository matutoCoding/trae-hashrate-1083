import { useState } from 'react';
import { Receipt, User, Package, DollarSign, FileText, CheckCircle, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { ModuleHeader } from '../components/ui/ModuleHeader';
import { useAppStore } from '../store/useAppStore';
import { SalesOrder } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { mockMonthlyProduction, mockProductDistribution } from '../data/mockData';

export function Sales() {
  const { salesOrders, batches, addSalesOrder, updateBatchStatus, getDashboardStats } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const stats = getDashboardStats();
  const [formData, setFormData] = useState<{
    batchId: string;
    customerName: string;
    productType: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    saleDate: string;
    status: 'pending' | 'shipped' | 'completed';
    notes: string;
  }>({
    batchId: '',
    customerName: '',
    productType: '红方腐乳',
    quantity: 100,
    unitPrice: 18,
    totalAmount: 1800,
    saleDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSalesOrder(formData);
    if (formData.batchId && formData.status === 'completed') {
      updateBatchStatus(formData.batchId, 'sold', 8);
    }
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'batchId' || name === 'customerName' || name === 'productType' || name === 'status' || name === 'notes' || name === 'saleDate'
        ? value 
        : Number(value) || value,
    }));
    
    if (name === 'quantity' || name === 'unitPrice') {
      const qty = name === 'quantity' ? Number(value) : formData.quantity;
      const price = name === 'unitPrice' ? Number(value) : formData.unitPrice;
      setFormData(prev => ({ ...prev, totalAmount: qty * price }));
    }
  };

  const getBatchNumber = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    return batch?.batchNumber || '-';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-normal';
      case 'shipped': return 'status-warning';
      default: return 'status-alert';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'shipped': return '已发货';
      default: return '待处理';
    }
  };

  const COLORS = ['#8B0000', '#556B2F', '#DEB887'];

  return (
    <div>
      <ModuleHeader
        title="销售台账"
        description="销售订单管理、出库记录、财务统计"
        icon={Receipt}
        currentStep={7}
        showAddButton
        onAddClick={() => setShowForm(true)}
        addButtonText="新增销售订单"
      />

      {showForm && (
        <div className="fixed inset-0 bg-cream-900/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-cream-900">新增销售订单</h2>
              <button onClick={() => setShowForm(false)} className="text-cream-500 hover:text-cream-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">选择批次</label>
                  <select name="batchId" value={formData.batchId} onChange={handleInputChange} className="input-field" required>
                    <option value="">请选择生产批次</option>
                    {batches.filter(b => b.status === 'completed' || b.status === 'sold').map(batch => (
                      <option key={batch.id} value={batch.id}>{batch.batchNumber}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text"><User className="w-4 h-4 inline mr-1" /> 客户名称</label>
                  <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text"><Package className="w-4 h-4 inline mr-1" /> 产品类型</label>
                  <select name="productType" value={formData.productType} onChange={handleInputChange} className="input-field">
                    <option value="红方腐乳">红方腐乳</option>
                    <option value="香辣红方">香辣红方</option>
                    <option value="青方腐乳">青方腐乳</option>
                    <option value="白方腐乳">白方腐乳</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">销售日期</label>
                  <input type="date" name="saleDate" value={formData.saleDate} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label-text">销售数量 (瓶)</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="label-text">单价 (元)</label>
                  <input type="number" step="0.01" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label className="label-text"><DollarSign className="w-4 h-4 inline mr-1" /> 总金额</label>
                  <div className="input-field bg-cream-100 font-bold text-primary-600">¥ {formData.totalAmount.toLocaleString()}</div>
                </div>
              </div>

              <div>
                <label className="label-text">订单状态</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="input-field">
                  <option value="pending">待处理</option>
                  <option value="shipped">已发货</option>
                  <option value="completed">已完成</option>
                </select>
              </div>

              <div>
                <label className="label-text"><FileText className="w-4 h-4 inline mr-1" /> 备注</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input-field h-24 resize-none" placeholder="订单备注..." />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">取消</button>
                <button type="submit" className="btn-primary"><CheckCircle className="w-4 h-4 inline mr-2" />保存订单</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card opacity-0 animate-stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cream-600 mb-1">累计销售额</p>
              <p className="text-2xl font-bold text-cream-900 font-serif">¥ {stats.totalSales.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center"><DollarSign className="w-6 h-6 text-primary-600" /></div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-fermentation-normal text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>较上月增长 15%</span>
          </div>
        </div>

        <div className="card opacity-0 animate-stagger-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cream-600 mb-1">待处理订单</p>
              <p className="text-2xl font-bold text-cream-900 font-serif">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><Receipt className="w-6 h-6 text-amber-600" /></div>
          </div>
          <p className="mt-2 text-xs text-amber-600">需要及时处理</p>
        </div>

        <div className="card opacity-0 animate-stagger-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cream-600 mb-1">本月销售</p>
              <p className="text-2xl font-bold text-cream-900 font-serif">{mockMonthlyProduction[5].销量.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center"><BarChart3 className="w-6 h-6 text-green-600" /></div>
          </div>
          <p className="mt-2 text-xs text-cream-500">瓶</p>
        </div>

        <div className="card opacity-0 animate-stagger-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cream-600 mb-1">客户数量</p>
              <p className="text-2xl font-bold text-cream-900 font-serif">12</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><User className="w-6 h-6 text-blue-600" /></div>
          </div>
          <p className="mt-2 text-xs text-cream-500">家合作客户</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card opacity-0 animate-stagger-5">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">月度产销量统计</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyProduction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />
                <XAxis dataKey="month" stroke="#7D5A4F" fontSize={12} />
                <YAxis stroke="#7D5A4F" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FDF5E6', border: '1px solid #C4A57B', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="产量" fill="#8B0000" radius={[4, 4, 0, 0]} />
                <Bar dataKey="销量" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card opacity-0 animate-stagger-6">
          <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">产品销售占比</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={mockProductDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockProductDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FDF5E6', border: '1px solid #C4A57B', borderRadius: '8px' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card opacity-0 animate-stagger-7">
        <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">销售订单列表</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">订单号</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">客户名称</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">产品类型</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">数量</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">单价</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">总金额</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">销售日期</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">状态</th>
              </tr>
            </thead>
            <tbody>
              {salesOrders.map((order: SalesOrder, index: number) => (
                <tr key={order.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4"><span className="font-mono text-sm">{order.id.slice(-8).toUpperCase()}</span></td>
                  <td className="py-3 px-4 text-sm text-cream-700">{order.customerName}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{order.productType}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">{order.quantity.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-cream-700">¥{order.unitPrice}</td>
                  <td className="py-3 px-4 text-sm font-bold text-primary-600">¥{order.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-cream-500">{order.saleDate}</td>
                  <td className="py-3 px-4">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
