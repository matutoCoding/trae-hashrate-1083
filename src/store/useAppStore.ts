import { create } from 'zustand';
import { 
  ProductionBatch, 
  GrindingRecord, 
  PressingRecord, 
  CultivationRecord, 
  BottlingRecord, 
  FermentationRecord, 
  PackagingRecord, 
  SalesOrder,
  DashboardStats,
  TemperatureHumidity,
  BatchStatus
} from '../types';
import { 
  mockBatches, 
  mockGrindingRecords, 
  mockPressingRecords, 
  mockCultivationRecords, 
  mockBottlingRecords, 
  mockFermentationRecords, 
  mockPackagingRecords, 
  mockSalesOrders,
  generateTemperatureHumidityData 
} from '../data/mockData';

interface AppState {
  batches: ProductionBatch[];
  grindingRecords: GrindingRecord[];
  pressingRecords: PressingRecord[];
  cultivationRecords: CultivationRecord[];
  bottlingRecords: BottlingRecord[];
  fermentationRecords: FermentationRecord[];
  packagingRecords: PackagingRecord[];
  salesOrders: SalesOrder[];
  temperatureHumidityData: TemperatureHumidity[];
  selectedBatch: ProductionBatch | null;
  sidebarCollapsed: boolean;
  
  addGrindingRecord: (record: Omit<GrindingRecord, 'id' | 'createdAt'>) => void;
  addPressingRecord: (record: Omit<PressingRecord, 'id' | 'createdAt'>) => void;
  addCultivationRecord: (record: Omit<CultivationRecord, 'id' | 'createdAt'>) => void;
  addBottlingRecord: (record: Omit<BottlingRecord, 'id' | 'createdAt'>) => void;
  addFermentationRecord: (record: Omit<FermentationRecord, 'id' | 'createdAt'>) => void;
  addPackagingRecord: (record: Omit<PackagingRecord, 'id' | 'createdAt'>) => void;
  addSalesOrder: (order: Omit<SalesOrder, 'id'>) => void;
  
  updateBatchStatus: (batchId: string, status: BatchStatus, currentStep: number) => void;
  selectBatch: (batch: ProductionBatch | null) => void;
  toggleSidebar: () => void;
  updateTemperatureHumidity: () => void;
  
  getDashboardStats: () => DashboardStats;
  getActiveBatches: () => ProductionBatch[];
  getBatchById: (id: string) => ProductionBatch | undefined;
}

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useAppStore = create<AppState>((set, get) => ({
  batches: mockBatches,
  grindingRecords: mockGrindingRecords,
  pressingRecords: mockPressingRecords,
  cultivationRecords: mockCultivationRecords,
  bottlingRecords: mockBottlingRecords,
  fermentationRecords: mockFermentationRecords,
  packagingRecords: mockPackagingRecords,
  salesOrders: mockSalesOrders,
  temperatureHumidityData: generateTemperatureHumidityData(24),
  selectedBatch: null,
  sidebarCollapsed: false,

  addGrindingRecord: (record) => {
    const newRecord: GrindingRecord = {
      ...record,
      id: generateId('grind'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => ({
      grindingRecords: [...state.grindingRecords, newRecord],
    }));
  },

  addPressingRecord: (record) => {
    const newRecord: PressingRecord = {
      ...record,
      id: generateId('press'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => ({
      pressingRecords: [...state.pressingRecords, newRecord],
    }));
  },

  addCultivationRecord: (record) => {
    const newRecord: CultivationRecord = {
      ...record,
      id: generateId('cult'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => ({
      cultivationRecords: [...state.cultivationRecords, newRecord],
    }));
  },

  addBottlingRecord: (record) => {
    const newRecord: BottlingRecord = {
      ...record,
      id: generateId('bottle'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => ({
      bottlingRecords: [...state.bottlingRecords, newRecord],
    }));
  },

  addFermentationRecord: (record) => {
    const newRecord: FermentationRecord = {
      ...record,
      id: generateId('ferm'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => ({
      fermentationRecords: [...state.fermentationRecords, newRecord],
    }));
  },

  addPackagingRecord: (record) => {
    const newRecord: PackagingRecord = {
      ...record,
      id: generateId('pack'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => ({
      packagingRecords: [...state.packagingRecords, newRecord],
    }));
  },

  addSalesOrder: (order) => {
    const newOrder: SalesOrder = {
      ...order,
      id: generateId('order'),
    };
    set((state) => ({
      salesOrders: [...state.salesOrders, newOrder],
    }));
  },

  updateBatchStatus: (batchId, status, currentStep) => {
    set((state) => ({
      batches: state.batches.map((batch) =>
        batch.id === batchId ? { ...batch, status, currentStep } : batch
      ),
    }));
  },

  selectBatch: (batch) => set({ selectedBatch: batch }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  updateTemperatureHumidity: () => {
    set({ temperatureHumidityData: generateTemperatureHumidityData(24) });
  },

  getDashboardStats: () => {
    const state = get();
    const completedBatches = state.batches.filter(b => b.status === 'completed' || b.status === 'sold');
    const activeBatches = state.batches.filter(b => b.status !== 'completed' && b.status !== 'sold');
    const totalSales = state.salesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = state.salesOrders.filter(o => o.status === 'pending').length;
    
    const latestData = state.temperatureHumidityData;
    const avgTemp = latestData.reduce((sum, d) => sum + d.temperature, 0) / latestData.length;
    const avgHumidity = latestData.reduce((sum, d) => sum + d.humidity, 0) / latestData.length;
    
    const monthlyProduction = state.batches
      .filter(b => b.startDate.startsWith('2026-06'))
      .reduce((sum, b) => sum + b.totalOutput, 0);

    return {
      totalBatches: state.batches.length,
      activeBatches: activeBatches.length,
      completedBatches: completedBatches.length,
      totalSales,
      avgTemperature: Math.round(avgTemp * 10) / 10,
      avgHumidity: Math.round(avgHumidity * 10) / 10,
      monthlyProduction,
      pendingOrders,
    };
  },

  getActiveBatches: () => {
    return get().batches.filter(b => b.status !== 'completed' && b.status !== 'sold');
  },

  getBatchById: (id) => {
    return get().batches.find(b => b.id === id);
  },
}));
