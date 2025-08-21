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

// 页面边距设置
export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// 页眉页脚设置
export interface HeaderFooter {
  header: {
    enabled: boolean;
    text: string;
    fontSize: number;
    alignment: 'left' | 'center' | 'right';
  };
  footer: {
    enabled: boolean;
    text: string;
    fontSize: number;
    alignment: 'left' | 'center' | 'right';
  };
}

// 自定义颜色设置
export interface CustomColorSettings {
  enabled: boolean;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
}

// 打印设置
export interface PrintSettings {
  quality: 'draft' | 'normal' | 'high';
  colorMode: 'color' | 'grayscale' | 'blackwhite' | 'custom';
  copies: number;
  orientation: 'portrait' | 'landscape';
  margins: PageMargins;
  headerFooter: HeaderFooter;
  customColors: CustomColorSettings;
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