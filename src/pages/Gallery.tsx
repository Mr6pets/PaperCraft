import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Filter, Grid, List, Search, Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../hooks/useAuth';
import { Category, Style } from '../types';
import { getCategories, getStyles, getCategoryById } from '../services/dataService';
import { useAppStore } from '../store';
import StyleIcon from '../components/StyleIcon';

const Gallery = () => {
  const { category: categoryParam } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { selectedCategory, setSelectedCategory } = useAppStore();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // 获取所有标签
  const allTags = Array.from(new Set(styles.flatMap(style => style.tags)));

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadStyles = async () => {
      setLoading(true);
      try {
        const categoryId = categoryParam || selectedCategory;
        const stylesData = await getStyles({
          category: categoryId || undefined,
          search: searchTerm || undefined,
          limit: 50
        });
        setStyles(stylesData.styles);
        
        if (categoryId) {
          const categoryData = await getCategoryById(categoryId);
          setCurrentCategory(categoryData);
        } else {
          setCurrentCategory(null);
        }
      } catch (error) {
        console.error('Failed to load styles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStyles();
  }, [categoryParam, selectedCategory, searchTerm]);

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentCategory(null);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 根据选中的标签过滤样式
  const filteredStyles = selectedTags.length > 0 
    ? styles.filter(style => 
        selectedTags.some(tag => style.tags.includes(tag))
      )
    : styles;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0EA5E9]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1E293B]">
            {currentCategory ? currentCategory.name : '样式库'}
          </h1>
          <p className="text-sm sm:text-base text-[#0EA5E9] mt-1">
            {currentCategory 
              ? currentCategory.description 
              : `共 ${filteredStyles.length} 个样式`
            }
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="搜索样式..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 pl-10 border-2 border-[#0EA5E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#0284C7] text-base min-h-[48px] transition-all"
            />
            <Search className="absolute left-3 top-3.5 text-[#0EA5E9]" size={18} />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white' 
                  : 'text-[#0EA5E9] hover:text-[#0284C7]'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white' 
                  : 'text-[#0EA5E9] hover:text-[#0284C7]'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-4 sm:space-y-6">
          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
            <h3 className="font-semibold text-[#1E293B] mb-3 flex items-center text-sm sm:text-base">
              <Filter className="mr-2" size={16} />
              分类筛选
            </h3>
            <div className="space-y-1 sm:space-y-2">
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`w-full text-left px-3 py-3 rounded-md transition-colors min-h-[44px] text-sm sm:text-base ${
                  !selectedCategory && !categoryParam
                    ? 'bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white'
                    : 'hover:bg-gradient-to-r hover:from-[#F0F9FF] hover:to-[#ECFDF5]'
                }`}
              >
                全部分类
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`w-full text-left px-3 py-3 rounded-md transition-colors min-h-[44px] text-sm sm:text-base ${
                    (selectedCategory === category.id || categoryParam === category.id)
                      ? 'bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white'
                      : 'hover:bg-gradient-to-r hover:from-[#F0F9FF] hover:to-[#ECFDF5]'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
              <h3 className="font-semibold text-[#1E293B] mb-3 text-sm sm:text-base">
                标签筛选
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 p-2 bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] rounded-lg border border-[#E5E7EB]">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[40px] flex items-center justify-center text-center ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white shadow-md transform scale-105'
                        : 'bg-white text-[#0EA5E9] hover:bg-gradient-to-r hover:from-[#E0F2FE] hover:to-[#D1FAE5] border border-[#0EA5E9] hover:shadow-sm hover:transform hover:scale-102'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-3 text-sm text-[#0EA5E9] hover:underline"
                >
                  清除标签筛选
                </button>
              )}
            </div>
          )}
        </div>

        {/* Styles Grid/List */}
        <div className="flex-1">
          {filteredStyles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#0EA5E9] text-lg">暂无匹配的样式</p>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
                : 'space-y-3 sm:space-y-4'
            }`}>
              {filteredStyles.map((style) => (
                <Link
                  key={style.id}
                  to={`/preview/${style.id}`}
                  className={`group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'aspect-[4/3]' 
                      : 'w-24 h-18 sm:w-32 sm:h-24 flex-shrink-0'
                  } overflow-hidden relative bg-gradient-to-br from-[#F0F9FF] to-[#ECFDF5] flex items-center justify-center`}>
                    {(style as any).useIcon ? (
                      <StyleIcon
                        styleId={style.id}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <img
                        src={style.thumbnailUrl}
                        alt={style.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,${encodeURIComponent(
                            `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><rect width="300" height="225" fill="#F0F9FF"/><text x="150" y="120" text-anchor="middle" fill="#1E293B" font-size="18">${style.name}</text></svg>`
                          )}`;
                        }}
                      />
                    )}
                    {/* 收藏按钮 */}
                    {user && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(style);
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                          isFavorite(style.id)
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                        }`}
                        title={isFavorite(style.id) ? '取消收藏' : '添加收藏'}
                      >
                        <Heart
                          size={16}
                          className={isFavorite(style.id) ? 'fill-current' : ''}
                        />
                      </button>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex-1">
                    <h3 className="font-semibold text-[#0EA5E9] mb-2 group-hover:text-[#0284C7] transition-colors text-sm sm:text-base leading-tight">
                      {style.name}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {style.tags.slice(0, viewMode === 'list' ? (window.innerWidth < 640 ? 3 : 5) : 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] text-[#0EA5E9] text-xs rounded-full border border-[#0EA5E9]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;