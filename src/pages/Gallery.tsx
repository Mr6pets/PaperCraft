import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Category, Style } from '../types';
import { getCategories, getStyles, getCategoryById } from '../services/dataService';
import { useAppStore } from '../store';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2D5A27]">
            {currentCategory ? currentCategory.name : '样式库'}
          </h1>
          <p className="text-gray-600 mt-1">
            {currentCategory 
              ? currentCategory.description 
              : `共 ${filteredStyles.length} 个样式`
            }
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="搜索样式..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#2D5A27] text-white' 
                  : 'text-gray-600 hover:text-[#2D5A27]'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#2D5A27] text-white' 
                  : 'text-gray-600 hover:text-[#2D5A27]'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-6">
          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-[#2D5A27] mb-3 flex items-center">
              <Filter className="mr-2" size={18} />
              分类筛选
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  !selectedCategory && !categoryParam
                    ? 'bg-[#2D5A27] text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                全部分类
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    (selectedCategory === category.id || categoryParam === category.id)
                      ? 'bg-[#2D5A27] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-[#2D5A27] mb-3">
                标签筛选
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-[#2D5A27] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-3 text-sm text-[#2D5A27] hover:underline"
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
              <p className="text-gray-500 text-lg">暂无匹配的样式</p>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
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
                      : 'w-32 h-24 flex-shrink-0'
                  } overflow-hidden`}>
                    <img
                      src={style.thumbnailUrl}
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,${encodeURIComponent(
                          `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><rect width="300" height="225" fill="#F8F6F0"/><text x="150" y="120" text-anchor="middle" fill="#2D5A27" font-size="18">${style.name}</text></svg>`
                        )}`;
                      }}
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-[#2D5A27] mb-2 group-hover:text-[#3D6A37] transition-colors">
                      {style.name}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {style.tags.slice(0, viewMode === 'list' ? 5 : 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[#F4C2C2] text-[#2D5A27] text-xs rounded-full"
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