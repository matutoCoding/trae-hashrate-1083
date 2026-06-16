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

const STORAGE_KEY = 'fermentation-workshop-data';

interface PersistedData {
  batches: ProductionBatch[];
  grindingRecords: GrindingRecord[];
  pressingRecords: PressingRecord[];
  cultivationRecords: CultivationRecord[];
  bottlingRecords: BottlingRecord[];
  fermentationRecords: FermentationRecord[];
  packagingRecords: PackagingRecord[];
  salesOrders: SalesOrder[];
}

const loadFromStorage = (): PersistedData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return null;
};

const saveToStorage = (data: PersistedData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

const getInitialData = (): PersistedData => {
  const stored = loadFromStorage();
  if (stored) {
    return stored;
  }
  return {
    batches: mockBatches,
    grindingRecords: mockGrindingRecords,
    pressingRecords: mockPressingRecords,
    cultivationRecords: mockCultivationRecords,
    bottlingRecords: mockBottlingRecords,
    fermentationRecords: mockFermentationRecords,
    packagingRecords: mockPackagingRecords,
    salesOrders: mockSalesOrders,
  };
};

const initialData = getInitialData();

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
  resetData: () => void;
  
  getDashboardStats: () => DashboardStats;
  getActiveBatches: () => ProductionBatch[];
  getBatchById: (id: string) => ProductionBatch | undefined;
}

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useAppStore = create<AppState>((set, get) => ({
  batches: initialData.batches,
  grindingRecords: initialData.grindingRecords,
  pressingRecords: initialData.pressingRecords,
  cultivationRecords: initialData.cultivationRecords,
  bottlingRecords: initialData.bottlingRecords,
  fermentationRecords: initialData.fermentationRecords,
  packagingRecords: initialData.packagingRecords,
  salesOrders: initialData.salesOrders,
  temperatureHumidityData: generateTemperatureHumidityData(24),
  selectedBatch: null,
  sidebarCollapsed: false,

  addGrindingRecord: (record) => {
    const newRecord: GrindingRecord = {
      ...record,
      id: generateId('grind'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => {
      const newState = {
        grindingRecords: [...state.grindingRecords, newRecord],
      };
      saveToStorage({
        batches: state.batches,
        grindingRecords: newState.grindingRecords,
        pressingRecords: state.pressingRecords,
        cultivationRecords: state.cultivationRecords,
        bottlingRecords: state.bottlingRecords,
        fermentationRecords: state.fermentationRecords,
        packagingRecords: state.packagingRecords,
        salesOrders: state.salesOrders,
      });
      return newState;
    });
  },

  addPressingRecord: (record) => {
    const newRecord: PressingRecord = {
      ...record,
      id: generateId('press'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => {
      const newState = {
        pressingRecords: [...state.pressingRecords, newRecord],
      };
      saveToStorage({
        batches: state.batches,
        grindingRecords: state.grindingRecords,
        pressingRecords: newState.pressingRecords,
        cultivationRecords: state.cultivationRecords,
        bottlingRecords: state.bottlingRecords,
        fermentationRecords: state.fermentationRecords,
        packagingRecords: state.packagingRecords,
        salesOrders: state.salesOrders,
      });
      return newState;
    });
  },

  addCultivationRecord: (record) => {
    const newRecord: CultivationRecord = {
      ...record,
      id: generateId('cult'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => {
      const newState = {
        cultivationRecords: [...state.cultivationRecords, newRecord],
      };
      saveToStorage({
        batches: state.batches,
        grindingRecords: state.grindingRecords,
        pressingRecords: state.pressingRecords,
        cultivationRecords: newState.cultivationRecords,
        bottlingRecords: state.bottlingRecords,
        fermentationRecords: state.fermentationRecords,
        packagingRecords: state.packagingRecords,
        salesOrders: state.salesOrders,
      });
      return newState;
    });
  },

  addBottlingRecord: (record) => {
    const newRecord: BottlingRecord = {
      ...record,
      id: generateId('bottle'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => {
      const newState = {
        bottlingRecords: [...state.bottlingRecords, newRecord],
      };
      saveToStorage({
        batches: state.batches,
        grindingRecords: state.grindingRecords,
        pressingRecords: state.pressingRecords,
        cultivationRecords: state.cultivationRecords,
        bottlingRecords: newState.bottlingRecords,
        fermentationRecords: state.fermentationRecords,
        packagingRecords: state.packagingRecords,
        salesOrders: state.salesOrders,
      });
      return newState;
    });
  },

  addFermentationRecord: (record) => {
    const newRecord: FermentationRecord = {
      ...record,
      id: generateId('ferm'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => {
      const newState = {
        fermentationRecords: [...state.fermentationRecords, newRecord],
      };
      saveToStorage({
        batches: state.batches,
        grindingRecords: state.grindingRecords,
        pressingRecords: state.pressingRecords,
        cultivationRecords: state.cultivationRecords,
        bottlingRecords: state.bottlingRecords,
        fermentationRecords: newState.fermentationRecords,
        packagingRecords: state.packagingRecords,
        salesOrders: state.salesOrders,
      });
      return newState;
    });
  },

  addPackagingRecord: (record) => {
    const newRecord: PackagingRecord = {
      ...record,
      id: generateId('pack'),
      createdAt: new Date().toISOString().replace('T', ' ').substr(0, 19),
    };
    set((state) => {
      const newState = {
        packagingRecords: [...state.packagingRecords, newRecord],
      };
      saveToStorage({
        batches: state.batches,
        grindingRecords: state.grindingRecords,
        pressingRecords: state.pressingRecords,
        cultivationRecords: state.cultivationRecords,
        bottlingRecords: state.bottlingRecords,
        fermentationRecords: state.fermentationRecords,
        packagingRecords: newState.packagingRecords,
        salesOrders: state.salesOrders,
      });
      return newState;
    });
  },

  addSalesOrder: (order) => {
    const newOrder: SalesOrder = {
      ...order,
      id: generateId('order'),
    };
    set((state) => {
      const newState = {
        salesOrders: [...state.salesOrders, newOrder],
      };
      saveToStorage({
        batches: state.batches,
        grindingRecords: state.grindingRecords,
        pressingRecords: state.pressingRecords,
        cultivationRecords: state.cultivationRecords,
        bottlingRecords: state.bottlingRecords,
        fermentationRecords: state.fermentationRecords,
        packagingRecords: state.packagingRecords,
        salesOrders: newState.salesOrders,
      });
      return newState;
    });
  },

  updateBatchStatus: (batchId, status, currentStep) => {
    set((state) => {
      const newBatches = state.batches.map((batch) =>
        batch.id === batchId ? { ...batch, status, currentStep } : batch
      );
      const newState = { batches: newBatches };
      saveToStorage({
        batches: newBatches,
        grindingRecords: state.grindingRecords,
        pressingRecords: state.pressingRecords,
        cultivationRecords: state.cultivationRecords,
        bottlingRecords: state.bottlingRecords,
        fermentationRecords: state.fermentationRecords,
        packagingRecords: state.packagingRecords,
        salesOrders: state.salesOrders,
      });
      return newState;
    });
  },

  selectBatch: (batch) => set({ selectedBatch: batch }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  updateTemperatureHumidity: () => {
    set({ temperatureHumidityData: generateTemperatureHumidityData(24) });
  },

  resetData: () => {
    const defaultData = {
      batches: mockBatches,
      grindingRecords: mockGrindingRecords,
      pressingRecords: mockPressingRecords,
      cultivationRecords: mockCultivationRecords,
      bottlingRecords: mockBottlingRecords,
      fermentationRecords: mockFermentationRecords,
      packagingRecords: mockPackagingRecords,
      salesOrders: mockSalesOrders,
    };
    saveToStorage(defaultData);
    set(defaultData);
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
