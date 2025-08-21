import { Category, Style, SearchParams, StylesResponse } from '../types';
import categoriesData from '../data/categories.json';
import stylesData from '../data/styles.json';

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取所有分类
export const getCategories = async (): Promise<Category[]> => {
  await delay(300);
  return categoriesData as Category[];
};

// 获取样式列表
export const getStyles = async (params: SearchParams = {}): Promise<StylesResponse> => {
  await delay(500);
  
  let filteredStyles = stylesData as Style[];
  
  // 按分类筛选
  if (params.category) {
    filteredStyles = filteredStyles.filter(style => style.categoryId === params.category);
  }
  
  // 按搜索关键词筛选
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredStyles = filteredStyles.filter(style => 
      style.name.toLowerCase().includes(searchLower) ||
      style.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  // 分页
  const limit = params.limit || 12;
  const offset = params.offset || 0;
  const total = filteredStyles.length;
  const paginatedStyles = filteredStyles.slice(offset, offset + limit);
  
  return {
    styles: paginatedStyles,
    total,
    hasMore: offset + limit < total
  };
};

// 根据ID获取单个样式
export const getStyleById = async (id: string): Promise<Style | null> => {
  await delay(200);
  const style = stylesData.find(s => s.id === id);
  return style ? style as Style : null;
};

// 获取热门样式（前6个）
export const getPopularStyles = async (): Promise<Style[]> => {
  await delay(300);
  return (stylesData as Style[]).slice(0, 6);
};

// 根据分类ID获取分类信息
export const getCategoryById = async (id: string): Promise<Category | null> => {
  await delay(200);
  const category = categoriesData.find(c => c.id === id);
  return category ? category as Category : null;
};

// 获取相关样式（同分类的其他样式）
export const getRelatedStyles = async (styleId: string, limit: number = 4): Promise<Style[]> => {
  await delay(300);
  
  const currentStyle = stylesData.find(s => s.id === styleId) as Style;
  if (!currentStyle) return [];
  
  const relatedStyles = (stylesData as Style[])
    .filter(style => style.categoryId === currentStyle.categoryId && style.id !== styleId)
    .slice(0, limit);
  
  return relatedStyles;
};