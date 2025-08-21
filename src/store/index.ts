import { create } from 'zustand';
import { Category, Style, PrintJob, PrintHistory } from '../types';

interface AppState {
  // 分类数据
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  
  // 样式数据
  styles: Style[];
  setStyles: (styles: Style[]) => void;
  
  // 搜索状态
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // 选中的分类
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  
  // 打印队列
  printQueue: PrintJob[];
  addToPrintQueue: (job: PrintJob) => void;
  updatePrintJob: (jobId: string, updates: Partial<PrintJob>) => void;
  removePrintJob: (jobId: string) => void;
  
  // 打印历史
  printHistory: PrintHistory[];
  addToPrintHistory: (record: PrintHistory) => void;
  
  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  categories: [],
  styles: [],
  searchQuery: '',
  selectedCategory: null,
  printQueue: [],
  printHistory: [],
  isLoading: false,
  
  // 分类相关
  setCategories: (categories) => set({ categories }),
  
  // 样式相关
  setStyles: (styles) => set({ styles }),
  
  // 搜索相关
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  // 分类选择
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  
  // 打印队列管理
  addToPrintQueue: (job) => set((state) => ({ 
    printQueue: [...state.printQueue, job] 
  })),
  
  updatePrintJob: (jobId, updates) => set((state) => ({
    printQueue: state.printQueue.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    )
  })),
  
  removePrintJob: (jobId) => set((state) => ({
    printQueue: state.printQueue.filter(job => job.id !== jobId)
  })),
  
  // 打印历史
  addToPrintHistory: (record) => set((state) => ({
    printHistory: [record, ...state.printHistory]
  })),
  
  // 加载状态
  setIsLoading: (isLoading) => set({ isLoading }),
}));