export type BatchStatus = 
  | 'grinding' 
  | 'pressing' 
  | 'cultivation' 
  | 'bottling' 
  | 'fermentation' 
  | 'packaging' 
  | 'completed' 
  | 'sold';

export type ProductType = 'red' | 'green' | 'white';
export type OrderStatus = 'pending' | 'shipped' | 'completed';

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  startDate: string;
  productType: ProductType;
  status: BatchStatus;
  totalOutput: number;
  currentStep: number;
}

export interface TemperatureHumidity {
  timestamp: string;
  temperature: number;
  humidity: number;
}

export interface GrindingRecord {
  id: string;
  batchId: string;
  soybeanAmount: number;
  waterAmount: number;
  cookingTemp: number;
  cookingTime: number;
  coagulantType: string;
  coagulantAmount: number;
  solidificationStatus: string;
  notes: string;
  createdAt: string;
}

export interface PressingRecord {
  id: string;
  batchId: string;
  pressure: number;
  pressingTime: number;
  blankSize: string;
  blankCount: number;
  arrangementPattern: string;
  notes: string;
  createdAt: string;
}

export interface CultivationRecord {
  id: string;
  batchId: string;
  moldStrain: string;
  inoculationAmount: number;
  temperature: number;
  humidity: number;
  cultivationDays: number;
  myceliumStatus: string;
  notes: string;
  createdAt: string;
}

export interface BottlingRecord {
  id: string;
  batchId: string;
  rubbingQuality: string;
  saltAmount: number;
  marinatingTime: number;
  soupFormula: string;
  jarCount: number;
  notes: string;
  createdAt: string;
}

export interface FermentationRecord {
  id: string;
  batchId: string;
  flavorType: string;
  seasoningFormula: string;
  fermentationTemp: number;
  fermentationDays: number;
  maturityLevel: string;
  notes: string;
  createdAt: string;
}

export interface PackagingRecord {
  id: string;
  batchId: string;
  bottleCount: number;
  soupStandard: string;
  sealingQuality: string;
  labelType: string;
  notes: string;
  createdAt: string;
}

export interface SalesOrder {
  id: string;
  batchId: string;
  customerName: string;
  productType: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: string;
  status: OrderStatus;
  notes: string;
}

export interface ProcessStep {
  id: number;
  name: string;
  description: string;
  icon: string;
  route: string;
  status: 'completed' | 'current' | 'pending';
}

export interface DashboardStats {
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  totalSales: number;
  avgTemperature: number;
  avgHumidity: number;
  monthlyProduction: number;
  pendingOrders: number;
}

export const STEP_NAMES: Record<BatchStatus, string> = {
  grinding: '磨浆点卤',
  pressing: '压坯划块',
  cultivation: '前期培菌',
  bottling: '搓毛装坛',
  fermentation: '后期发酵',
  packaging: '装瓶贴标',
  completed: '已完成',
  sold: '已销售',
};

export const PRODUCT_TYPE_NAMES: Record<ProductType, string> = {
  red: '红方',
  green: '青方',
  white: '白方',
};

export const PROCESS_STEPS: Omit<ProcessStep, 'status'>[] = [
  { id: 1, name: '磨浆点卤', description: '黄豆磨浆煮浆、点卤凝固', icon: 'Flame', route: '/grinding' },
  { id: 2, name: '压坯划块', description: '压榨成坯、白坯切块摆笼', icon: 'Box', route: '/pressing' },
  { id: 3, name: '前期培菌', description: '毛霉接种培菌、温湿控制', icon: 'Thermometer', route: '/cultivation' },
  { id: 4, name: '搓毛装坛', description: '搓毛腌坯、加料汤装坛', icon: 'FlaskConical', route: '/bottling' },
  { id: 5, name: '后期发酵', description: '红方青方调味、后发酵', icon: 'Clock', route: '/fermentation' },
  { id: 6, name: '装瓶贴标', description: '装瓶灌汤封口、标签管理', icon: 'Package', route: '/packaging' },
  { id: 7, name: '销售台账', description: '销售订单、财务统计', icon: 'Receipt', route: '/sales' },
];
