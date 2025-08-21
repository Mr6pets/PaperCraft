// 纸张样式分类
export interface Category {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  sortOrder: number;
  createdAt: string;
}

// 纸张样式
export interface Style {
  id: string;
  name: string;
  categoryId: string;
  thumbnailUrl: string;
  fullImageUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 打印设置
export interface PrintSettings {
  quality: 'draft' | 'normal' | 'high';
  colorMode: 'color' | 'grayscale' | 'blackwhite';
  copies: number;
  orientation: 'portrait' | 'landscape';
}

// 纸张尺寸
export type PaperSize = 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Custom';

// 打印历史记录
export interface PrintHistory {
  id: string;
  userId?: string;
  styleId: string;
  paperSize: PaperSize;
  printSettings: PrintSettings;
  status: 'pending' | 'printing' | 'completed' | 'failed';
  createdAt: string;
}

// 打印任务
export interface PrintJob {
  id: string;
  styleId: string;
  styleName: string;
  paperSize: PaperSize;
  printSettings: PrintSettings;
  status: 'pending' | 'printing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
}

// API响应类型
export interface StylesResponse {
  styles: Style[];
  total: number;
  hasMore: boolean;
}

// 搜索参数
export interface SearchParams {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}