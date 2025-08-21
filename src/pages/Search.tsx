import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Style, Category } from '../types';
import { getStyles, getCategories } from '../services/dataService';
import { useAppStore } from '../store';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [styles, setStyles] = useState<Style[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const { searchQuery, setSearchQuery } = useAppStore();

  const query = searchParams.get('q') || '';

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
    if (query) {
      setSearchQuery(query);
    }
  }, [query, setSearchQuery]);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!query) {
        setStyles([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const stylesData = await getStyles({
          search: query,
          category: selectedCategory || undefined,
          limit: 50
        });
        
        let sortedStyles = stylesData.styles;
        
        // 排序
        if (sortBy === 'name') {
          sortedStyles = [...sortedStyles].sort((a, b) => a.name.localeCompare(b.name));
        } else {
          sortedStyles = [...sortedStyles].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        
        setStyles(sortedStyles);
      } catch (error) {
        console.error('Failed to load search results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [query, selectedCategory, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSortBy('date');
  };

  if (!query) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <SearchIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <h1 className="text-3xl font-bold text-[#2D5A27] mb-4">搜索纸张样式</h1>
          <p className="text-gray-600 mb-8">输入关键词搜索您需要的纸张样式</p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索样式名称或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent text-lg"
              />
              <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
            <button
              type="submit"
              className="mt-4 px-8 py-3 bg-[#2D5A27] text-white rounded-lg hover:bg-[#3D6A37] transition-colors font-medium"
            >
              搜索
            </button>
          </form>
        </div>
        
        {/* Popular Search Terms */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#2D5A27] mb-4">热门搜索</h3>
          <div className="flex flex-wrap gap-2">
            {['花纹', '几何', '春节', '樱花', '渐变', '复古', '现代', '简约'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setSearchParams({ q: term });
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-[#F4C2C2] hover:text-[#2D5A27] transition-colors text-sm"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2D5A27]">
            搜索结果
          </h1>
          <p className="text-gray-600 mt-1">
            关键词 "{query}" 共找到 {styles.length} 个结果
          </p>
        </div>
        
        {/* New Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索样式..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
            />
            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#3D6A37] transition-colors"
          >
            搜索
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#2D5A27] flex items-center">
                <Filter className="mr-2" size={18} />
                筛选条件
              </h3>
              {(selectedCategory || sortBy !== 'date') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#2D5A27] hover:underline"
                >
                  清除
                </button>
              )}
            </div>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
              >
                <option value="">全部分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                排序方式
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
              >
                <option value="date">按时间排序</option>
                <option value="name">按名称排序</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27]"></div>
            </div>
          ) : styles.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg mb-4">未找到匹配的样式</p>
              <p className="text-gray-400 mb-6">尝试使用其他关键词或调整筛选条件</p>
              <Link
                to="/gallery"
                className="text-[#2D5A27] hover:underline"
              >
                浏览全部样式
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {styles.map((style) => (
                <Link
                  key={style.id}
                  to={`/preview/${style.id}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[4/3] overflow-hidden">
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
                  <div className="p-4">
                    <h3 className="font-semibold text-[#2D5A27] mb-2 group-hover:text-[#3D6A37] transition-colors">
                      {style.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {style.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[#F4C2C2] text-[#2D5A27] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(style.createdAt).toLocaleDateString()}
                    </p>
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

export default Search;