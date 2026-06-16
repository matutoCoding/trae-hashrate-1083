import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TemperatureHumidity } from '../../types';
import { Thermometer, Droplets, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TemperatureHumidityChartProps {
  data: TemperatureHumidity[];
  title?: string;
  showGauge?: boolean;
}

export function TemperatureHumidityChart({ 
  data, 
  title = '培菌室温湿度监控',
  showGauge = true 
}: TemperatureHumidityChartProps) {
  const [currentTemp, setCurrentTemp] = useState(22);
  const [currentHumidity, setCurrentHumidity] = useState(85);

  useEffect(() => {
    if (data.length > 0) {
      const latest = data[data.length - 1];
      setCurrentTemp(latest.temperature);
      setCurrentHumidity(latest.humidity);
    }
  }, [data]);

  const getTempStatus = (temp: number) => {
    if (temp >= 20 && temp <= 25) return { status: 'normal', label: '正常' };
    if (temp >= 18 && temp <= 27) return { status: 'warning', label: '注意' };
    return { status: 'alert', label: '异常' };
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity >= 80 && humidity <= 90) return { status: 'normal', label: '正常' };
    if (humidity >= 75 && humidity <= 95) return { status: 'warning', label: '注意' };
    return { status: 'alert', label: '异常' };
  };

  const tempStatus = getTempStatus(currentTemp);
  const humidityStatus = getHumidityStatus(currentHumidity);

  const tempRotation = ((currentTemp - 15) / 20) * 180 - 90;
  const humidityRotation = ((currentHumidity - 70) / 40) * 180 - 90;

  return (
    <div className="card h-full opacity-0 animate-stagger-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif font-semibold text-cream-900">{title}</h3>
        <div className="flex items-center gap-2">
          {tempStatus.status === 'normal' && humidityStatus.status === 'normal' ? (
            <span className="status-badge status-normal">
              <CheckCircle className="w-3 h-3 mr-1" />
              环境正常
            </span>
          ) : (
            <span className="status-badge status-warning animate-pulse-soft">
              <AlertTriangle className="w-3 h-3 mr-1" />
              需要关注
            </span>
          )}
        </div>
      </div>

      {showGauge && (
        <div className="flex gap-8 mb-6">
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-32 h-16 overflow-hidden">
              <div className="absolute w-32 h-32 rounded-full border-8 border-cream-200" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
              <div 
                className="absolute w-32 h-32 rounded-full border-8 border-primary-500" 
                style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
                  transformOrigin: 'center bottom',
                  transform: `rotate(${tempRotation}deg)`,
                  transition: 'transform 1s ease-out'
                }} 
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cream-800" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Thermometer className={`w-4 h-4 ${tempStatus.status === 'normal' ? 'text-fermentation-normal' : tempStatus.status === 'warning' ? 'text-fermentation-warning' : 'text-fermentation-alert'}`} />
              <span className="text-2xl font-bold text-cream-900">{currentTemp}°C</span>
            </div>
            <span className={`text-xs font-medium status-badge status-${tempStatus.status} mt-1`}>
              {tempStatus.label}
            </span>
            <span className="text-xs text-cream-500 mt-1">适宜范围: 20-25°C</span>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-32 h-16 overflow-hidden">
              <div className="absolute w-32 h-32 rounded-full border-8 border-cream-200" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
              <div 
                className="absolute w-32 h-32 rounded-full border-8 border-blue-500" 
                style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
                  transformOrigin: 'center bottom',
                  transform: `rotate(${humidityRotation}deg)`,
                  transition: 'transform 1s ease-out'
                }} 
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cream-800" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Droplets className={`w-4 h-4 ${humidityStatus.status === 'normal' ? 'text-fermentation-normal' : humidityStatus.status === 'warning' ? 'text-fermentation-warning' : 'text-fermentation-alert'}`} />
              <span className="text-2xl font-bold text-cream-900">{currentHumidity}%</span>
            </div>
            <span className={`text-xs font-medium status-badge status-${humidityStatus.status} mt-1`}>
              {humidityStatus.label}
            </span>
            <span className="text-xs text-cream-500 mt-1">适宜范围: 80-90%</span>
          </div>
        </div>
      )}

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#7D5A4F" 
              fontSize={12}
              tick={{ fill: '#7D5A4F' }}
            />
            <YAxis 
              stroke="#7D5A4F" 
              fontSize={12}
              tick={{ fill: '#7D5A4F' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FDF5E6', 
                border: '1px solid #C4A57B',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#C62828" 
              strokeWidth={2}
              dot={{ fill: '#C62828', r: 4 }}
              activeDot={{ r: 6 }}
              name="温度(°C)"
            />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#1976D2" 
              strokeWidth={2}
              dot={{ fill: '#1976D2', r: 4 }}
              activeDot={{ r: 6 }}
              name="湿度(%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
