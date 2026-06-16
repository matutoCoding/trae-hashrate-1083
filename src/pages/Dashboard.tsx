import { useEffect, useState, useMemo } from 'react';
import { 
  Layers, 
  PlayCircle, 
  CheckCircle2, 
  DollarSign, 
  Thermometer, 
  Droplets,
  TrendingUp,
  Clock,
  Package as PackageIcon,
  ChevronRight,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { StatCard } from '../components/ui/StatCard';
import { TemperatureHumidityChart } from '../components/Charts/TemperatureHumidityChart';
import { BatchFlowBoard } from '../components/BatchFlowBoard';
import { BatchDetailModal } from '../components/BatchDetailModal';
import { STEP_NAMES, PRODUCT_TYPE_NAMES } from '../types';
import { mockMonthlyProduction } from '../data/mockData';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#8B0000', '#2E8B57', '#D4AF37', '#4A6FA5', '#C2410C', '#7E57C2'];

export function Dashboard() {
  const navigate = useNavigate();
  const { 
    getDashboardStats, 
    getActiveBatches, 
    getProductDistribution,
    batches,
    salesOrders,
    temperatureHumidityData,
    updateTemperatureHumidity,
    selectedBatch,
    selectBatch,
    setShowBatchDetail
  } = useAppStore();
  
  const stats = getDashboardStats();
  const activeBatches = getActiveBatches();
  const productDistribution = useMemo(() => getProductDistribution(), [salesOrders, getProductDistribution]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const pendingOrders = useMemo(() => {
    return salesOrders.filter(o => o.status === 'pending');
  }, [salesOrders]);

  const shippedOrders = useMemo(() => {
    return salesOrders.filter(o => o.status === 'shipped');
  }, [salesOrders]);

  useEffect(() => {
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    const dataTimer = setInterval(() => updateTemperatureHumidity(), 300000);
    
    return () => {
      clearInterval(timeTimer);
      clearInterval(dataTimer);
    };
  }, [updateTemperatureHumidity]);

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'red': return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'green': return 'bg-green-100 text-green-700 border-green-200';
      case 'white': return 'bg-cream-200 text-cream-800 border-cream-300';
      default: return 'bg-cream-100 text-cream-700 border-cream-200';
    }
  };

  return (
    <div className="space-y-6">
      <BatchDetailModal />
      
      <div className="opacity-0 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-cream-900 mb-2">
              腐乳发酵作坊管理系统
            </h1>
            <p className="text-cream-600">
              今日是 {format(currentTime, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}，欢迎回来，陈师傅
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-800 font-medium">
                正在进行: <span className="font-bold">{activeBatches.length}</span> 批次
              </span>
            </div>
          </div>
        </div>

        <div className="opacity-0 animate-stagger-1">
          <BatchFlowBoard />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="总批次"
          value={stats.totalBatches}
          unit="批"
          icon={Layers}
          color="primary"
          delay={0.1}
        />
        <StatCard
          title="进行中"
          value={stats.activeBatches}
          unit="批"
          icon={PlayCircle}
          color="amber"
          trend={{ value: 12, isPositive: true }}
          delay={0.2}
        />
        <StatCard
          title="已完成"
          value={stats.completedBatches}
          unit="批"
          icon={CheckCircle2}
          color="green"
          trend={{ value: 8, isPositive: true }}
          delay={0.3}
        />
        <StatCard
          title="累计销售额"
          value={stats.totalSales}
          unit="元"
          icon={DollarSign}
          color="blue"
          trend={{ value: 15, isPositive: true }}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TemperatureHumidityChart 
            data={temperatureHumidityData}
            title="培菌室温湿度实时监控"
          />
        </div>

        <div className="space-y-4">
          <div className="card opacity-0 animate-stagger-4">
            <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">环境指标</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-cream-600">平均温度</p>
                    <p className="text-xl font-bold text-cream-900">{stats.avgTemperature}°C</p>
                  </div>
                </div>
                <span className="status-badge status-normal">适宜</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-cream-600">平均湿度</p>
                    <p className="text-xl font-bold text-cream-900">{stats.avgHumidity}%</p>
                  </div>
                </div>
                <span className="status-badge status-normal">适宜</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <PackageIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-cream-600">本月产量</p>
                    <p className="text-xl font-bold text-cream-900">{stats.monthlyProduction.toLocaleString()}</p>
                  </div>
                </div>
                <span className="text-sm text-cream-500">瓶</span>
              </div>
            </div>
          </div>

          <div className="card opacity-0 animate-stagger-5">
            <h3 className="text-lg font-serif font-semibold text-cream-900 mb-4">月度产销量</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMonthlyProduction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />
                  <XAxis dataKey="month" stroke="#7D5A4F" fontSize={12} />
                  <YAxis stroke="#7D5A4F" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FDF5E6', 
                      border: '1px solid #C4A57B',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="产量" fill="#8B0000" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="销量" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card opacity-0 animate-stagger-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-semibold text-cream-900">生产批次列表</h3>
              <div className="flex items-center gap-2 text-sm text-primary-600 cursor-pointer hover:underline">
                <span>查看全部</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">批次号</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">产品类型</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">开始日期</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">当前工序</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">预计产量</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cream-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch, index) => (
                    <tr 
                      key={batch.id} 
                      className={`border-b border-cream-100 hover:bg-cream-50 transition-colors
                        ${selectedBatch?.id === batch.id ? 'bg-primary-50' : ''}`}
                      onClick={() => selectBatch(selectedBatch?.id === batch.id ? null : batch)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-cream-900">{batch.batchNumber}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getProductTypeColor(batch.productType)}`}>
                          {PRODUCT_TYPE_NAMES[batch.productType]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-cream-700">{batch.startDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-cream-800">
                            {STEP_NAMES[batch.status]}
                          </span>
                          <div className="flex-1 max-w-24 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                              style={{ width: `${(batch.currentStep / 7) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-cream-700">{batch.totalOutput.toLocaleString()} 瓶</td>
                      <td className="py-3 px-4">
                        <span className={`status-badge ${
                          batch.status === 'completed' || batch.status === 'sold' 
                            ? 'status-normal' 
                            : 'status-warning'
                        }`}>
                          {batch.status === 'sold' ? '已销售' : 
                           batch.status === 'completed' ? '已完成' : '生产中'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectBatch(batch);
                            setShowBatchDetail(true);
                          }}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          查看履历
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card opacity-0 animate-stagger-7">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-semibold text-cream-900">产品销售占比</h3>
              <span className="text-xs text-cream-500">实时更新</span>
            </div>
            {productDistribution.length > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {productDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, '占比']}
                        contentStyle={{ 
                          backgroundColor: '#FDF5E6', 
                          border: '1px solid #C4A57B',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {productDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs text-cream-700">{item.name}</span>
                      <span className="text-xs font-semibold text-cream-900 ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-cream-500">
                暂无销售数据
              </div>
            )}
          </div>

          <div className="card opacity-0 animate-stagger-7 bg-gradient-to-br from-red-50 to-amber-50 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-serif font-semibold text-cream-900">待处理订单</h3>
              {pendingOrders.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                  {pendingOrders.length}
                </span>
              )}
            </div>
            
            {pendingOrders.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {pendingOrders.slice(0, 3).map((order) => (
                  <div 
                    key={order.id}
                    className="p-3 bg-white rounded-lg border border-cream-200 hover:border-red-300 transition-colors cursor-pointer"
                    onClick={() => navigate('/sales')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-sm text-cream-900">{order.customerName}</span>
                      </div>
                      <span className="text-xs text-cream-500">{order.saleDate}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-cream-600">
                        {order.productType} × {order.quantity.toLocaleString()}瓶
                      </span>
                      <span className="text-sm font-bold text-primary-700">
                        ¥{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-cream-500">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
                <p className="text-sm">暂无待处理订单</p>
              </div>
            )}

            {shippedOrders.length > 0 && (
              <div className="mt-3 pt-3 border-t border-cream-200">
                <p className="text-xs text-cream-600 mb-2">
                  已发货待确认: <span className="font-semibold text-amber-600">{shippedOrders.length}</span> 单
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('/sales')}
              className="w-full mt-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              查看全部订单
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
