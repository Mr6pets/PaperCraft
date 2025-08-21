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
          <SearchIcon className="mx-auto text-[#3B82F6] mb-4" size={48} />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#9333EA] bg-clip-text text-transparent mb-4">搜索纸张样式</h1>
          <p className="text-[#10B981] mb-8">输入关键词搜索您需要的纸张样式</p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索样式名称或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent text-lg"
              />
              <SearchIcon className="absolute left-4 top-3.5 text-[#3B82F6]" size={20} />
            </div>
            <button
              type="submit"
              className="mt-4 px-8 py-3 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284C7] transition-colors font-medium"
            >
              搜索
            </button>
          </form>
        </div>
        
        {/* Popular Search Terms */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-4">热门搜索</h3>
          <div className="flex flex-wrap gap-2">
            {['花纹', '几何', '春节', '樱花', '渐变', '复古', '现代', '简约'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setSearchParams({ q: term });
                }}
                className="px-3 py-1 bg-gradient-to-r from-[#F3E8FF] to-[#EDE9FE] text-[#7C3AED] rounded-full hover:from-[#E9D5FF] hover:to-[#DDD6FE] transition-all text-sm shadow-sm"
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
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] bg-clip-text text-transparent">
            搜索结果
          </h1>
          <p className="text-[#10B981] mt-1">
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
              className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
            />
            <SearchIcon className="absolute left-3 top-2.5 text-[#3B82F6]" size={18} />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-lg hover:from-[#2563EB] hover:to-[#1D4ED8] transition-all duration-300 shadow-lg hover:shadow-xl"
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
              <h3 className="font-semibold text-[#1E293B] flex items-center">
                <Filter className="mr-2" size={18} />
                筛选条件
              </h3>
              {(selectedCategory || sortBy !== 'date') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#0EA5E9] hover:underline"
                >
                  清除
                </button>
              )}
            </div>
            
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-2">
                分类
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A855F7] focus:border-[#3B82F6] transition-all"
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
              <label className="block text-sm font-medium text-[#374151] mb-2">
                排序方式
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
                className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A855F7] focus:border-[#3B82F6] transition-all"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0EA5E9]"></div>
            </div>
          ) : styles.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="mx-auto text-[#3B82F6] mb-4" size={48} />
              <p className="text-[#10B981] text-lg mb-4">未找到匹配的样式</p>
              <p className="text-[#3B82F6] mb-6">尝试使用其他关键词或调整筛选条件</p>
              <Link
                to="/gallery"
                className="text-[#0EA5E9] hover:underline"
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
                  className="group bg-gradient-to-br from-white to-[#FEF3F2] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={style.thumbnailUrl}
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,${encodeURIComponent(
                          `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><rect width="300" height="225" fill="#F8FAFC"/><text x="150" y="120" text-anchor="middle" fill="#0EA5E9" font-size="18">${style.name}</text></svg>`
                        )}`;
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1E293B] mb-2 group-hover:text-[#3B82F6] transition-colors">
                      {style.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {style.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-xs rounded-full shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[#10B981]">
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