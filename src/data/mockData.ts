import { 
  ProductionBatch, 
  GrindingRecord, 
  PressingRecord, 
  CultivationRecord, 
  BottlingRecord, 
  FermentationRecord, 
  PackagingRecord, 
  SalesOrder,
  TemperatureHumidity 
} from '../types';

export const mockBatches: ProductionBatch[] = [
  {
    id: 'batch-001',
    batchNumber: 'FR2026061501',
    startDate: '2026-06-15',
    productType: 'red',
    status: 'cultivation',
    totalOutput: 2500,
    currentStep: 3,
  },
  {
    id: 'batch-002',
    batchNumber: 'FR2026061401',
    startDate: '2026-06-14',
    productType: 'green',
    status: 'fermentation',
    totalOutput: 1800,
    currentStep: 5,
  },
  {
    id: 'batch-003',
    batchNumber: 'FR2026061301',
    startDate: '2026-06-13',
    productType: 'red',
    status: 'bottling',
    totalOutput: 3000,
    currentStep: 4,
  },
  {
    id: 'batch-004',
    batchNumber: 'FR2026061201',
    startDate: '2026-06-12',
    productType: 'white',
    status: 'pressing',
    totalOutput: 2200,
    currentStep: 2,
  },
  {
    id: 'batch-005',
    batchNumber: 'FR2026061001',
    startDate: '2026-06-10',
    productType: 'red',
    status: 'completed',
    totalOutput: 2800,
    currentStep: 6,
  },
  {
    id: 'batch-006',
    batchNumber: 'FR2026060801',
    startDate: '2026-06-08',
    productType: 'red',
    status: 'sold',
    totalOutput: 3200,
    currentStep: 7,
  },
];

export const mockGrindingRecords: GrindingRecord[] = [
  {
    id: 'grind-001',
    batchId: 'batch-001',
    soybeanAmount: 500,
    waterAmount: 1500,
    cookingTemp: 98,
    cookingTime: 45,
    coagulantType: '卤水',
    coagulantAmount: 25,
    solidificationStatus: '良好',
    notes: '豆浆浓度适中，凝固效果理想',
    createdAt: '2026-06-15 08:30:00',
  },
  {
    id: 'grind-002',
    batchId: 'batch-002',
    soybeanAmount: 360,
    waterAmount: 1080,
    cookingTemp: 96,
    cookingTime: 40,
    coagulantType: '石膏',
    coagulantAmount: 18,
    solidificationStatus: '良好',
    notes: '青方专用配方，卤水用量较少',
    createdAt: '2026-06-14 09:00:00',
  },
  {
    id: 'grind-003',
    batchId: 'batch-003',
    soybeanAmount: 600,
    waterAmount: 1800,
    cookingTemp: 99,
    cookingTime: 50,
    coagulantType: '卤水',
    coagulantAmount: 30,
    solidificationStatus: '优秀',
    notes: '大批量生产，温度控制精准',
    createdAt: '2026-06-13 07:30:00',
  },
];

export const mockPressingRecords: PressingRecord[] = [
  {
    id: 'press-001',
    batchId: 'batch-001',
    pressure: 80,
    pressingTime: 180,
    blankSize: '4x4x2cm',
    blankCount: 2500,
    arrangementPattern: '5x8网格',
    notes: '水分含量适中，坯体完整',
    createdAt: '2026-06-15 14:00:00',
  },
  {
    id: 'press-002',
    batchId: 'batch-003',
    pressure: 75,
    pressingTime: 160,
    blankSize: '4x4x2cm',
    blankCount: 3000,
    arrangementPattern: '6x8网格',
    notes: '大批量，分两笼摆放',
    createdAt: '2026-06-13 15:30:00',
  },
];

export const mockCultivationRecords: CultivationRecord[] = [
  {
    id: 'cult-001',
    batchId: 'batch-001',
    moldStrain: 'AS3.2778',
    inoculationAmount: 1.5,
    temperature: 22,
    humidity: 85,
    cultivationDays: 2,
    myceliumStatus: '菌丝生长良好',
    notes: '第2天，菌丝开始覆盖表面',
    createdAt: '2026-06-16 08:00:00',
  },
  {
    id: 'cult-002',
    batchId: 'batch-003',
    moldStrain: 'AS3.2778',
    inoculationAmount: 1.5,
    temperature: 21,
    humidity: 82,
    cultivationDays: 3,
    myceliumStatus: '菌丝浓密',
    notes: '即将进入搓毛阶段',
    createdAt: '2026-06-16 09:00:00',
  },
];

export const mockBottlingRecords: BottlingRecord[] = [
  {
    id: 'bottle-001',
    batchId: 'batch-003',
    rubbingQuality: '优秀',
    saltAmount: 45,
    marinatingTime: 48,
    soupFormula: '红方经典配方',
    jarCount: 500,
    notes: '搓毛完整，腌坯均匀',
    createdAt: '2026-06-16 10:00:00',
  },
];

export const mockFermentationRecords: FermentationRecord[] = [
  {
    id: 'ferm-001',
    batchId: 'batch-002',
    flavorType: '青方',
    seasoningFormula: '臭豆腐专用配方',
    fermentationTemp: 25,
    fermentationDays: 15,
    maturityLevel: '70%',
    notes: '发酵进行中，气味正常',
    createdAt: '2026-06-16 08:30:00',
  },
];

export const mockPackagingRecords: PackagingRecord[] = [
  {
    id: 'pack-001',
    batchId: 'batch-005',
    bottleCount: 1400,
    soupStandard: '红方标准',
    sealingQuality: '全部合格',
    labelType: '传统红方标签',
    notes: '包装完成，待销售',
    createdAt: '2026-06-15 16:00:00',
  },
];

export const mockSalesOrders: SalesOrder[] = [
  {
    id: 'order-001',
    batchId: 'batch-006',
    customerName: '北京老字号食品有限公司',
    productType: '红方腐乳',
    quantity: 3000,
    unitPrice: 18,
    totalAmount: 54000,
    saleDate: '2026-06-15',
    status: 'completed',
    notes: '长期合作客户，按时发货',
  },
  {
    id: 'order-002',
    batchId: 'batch-006',
    customerName: '上海美食汇商贸',
    productType: '红方腐乳',
    quantity: 200,
    unitPrice: 22,
    totalAmount: 4400,
    saleDate: '2026-06-16',
    status: 'pending',
    notes: '小批量零售订单',
  },
  {
    id: 'order-003',
    batchId: 'batch-005',
    customerName: '广州风味食品商行',
    productType: '红方腐乳',
    quantity: 1400,
    unitPrice: 19,
    totalAmount: 26600,
    saleDate: '2026-06-14',
    status: 'shipped',
    notes: '南方市场订单，已发货',
  },
];

export const generateTemperatureHumidityData = (count: number = 24): TemperatureHumidity[] => {
  const data: TemperatureHumidity[] = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    const baseTemp = 22;
    const baseHumidity = 85;
    const tempVariation = Math.sin(i / 6) * 2 + (Math.random() - 0.5) * 1;
    const humidityVariation = Math.cos(i / 4) * 3 + (Math.random() - 0.5) * 2;
    
    data.push({
      timestamp: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round((baseTemp + tempVariation) * 10) / 10,
      humidity: Math.round((baseHumidity + humidityVariation) * 10) / 10,
    });
  }
  
  return data;
};

export const mockMonthlyProduction = [
  { month: '1月', 产量: 8500, 销量: 8200 },
  { month: '2月', 产量: 9200, 销量: 8800 },
  { month: '3月', 产量: 10500, 销量: 10000 },
  { month: '4月', 产量: 11200, 销量: 10800 },
  { month: '5月', 产量: 12000, 销量: 11500 },
  { month: '6月', 产量: 11800, 销量: 9800 },
];

export const mockProductDistribution = [
  { name: '红方腐乳', value: 65, color: '#8B0000' },
  { name: '青方腐乳', value: 20, color: '#556B2F' },
  { name: '白方腐乳', value: 15, color: '#DEB887' },
];
