import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category, Style } from '../types';
import { getCategories, getPopularStyles } from '../services/dataService';
import { useAppStore } from '../store';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularStyles, setPopularStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedCategory } = useAppStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, stylesData] = await Promise.all([
          getCategories(),
          getPopularStyles()
        ]);
        setCategories(categoriesData);
        setPopularStyles(stylesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0EA5E9]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <Sparkles className="text-[#10B981] mr-2 sm:mr-3" size={24} />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#9333EA] bg-clip-text text-transparent leading-tight">
            PaperCraft 纸艺工坊
          </h1>
          <Sparkles className="text-[#10B981] ml-2 sm:ml-3" size={24} />
        </div>
        <p className="text-base sm:text-lg md:text-xl text-[#10B981] max-w-3xl mx-auto mb-6 sm:mb-8 px-4 text-center leading-relaxed">
          无需购买各种样式纸张，选择心仪的模板，实时预览效果，一键打印专属装饰纸张
        </p>
        <Link
          to="/gallery"
          className="inline-flex items-center px-6 sm:px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-lg hover:from-[#2563EB] hover:to-[#1D4ED8] transition-all duration-300 font-medium min-h-[48px] shadow-lg hover:shadow-xl"
        >
          开始探索
          <ArrowRight className="ml-2" size={18} />
        </Link>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] bg-clip-text text-transparent mb-6 sm:mb-8 text-center">
          纸张分类
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/gallery/${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
              className="group bg-gradient-to-br from-white to-[#F0F9FF] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 text-center border-2 border-transparent hover:border-[#A855F7] hover:scale-105"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[#F0F9FF] to-[#ECFDF5]">
                <img
                  src={category.iconUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" /><stop offset="100%" style="stop-color:#A855F7;stop-opacity:1" /></linearGradient></defs><rect width="64" height="64" fill="url(#grad)"/><text x="32" y="38" text-anchor="middle" fill="white" font-size="24">${category.name[0]}</text></svg>`
                    )}`;
                  }}
                />
              </div>
              <h3 className="font-semibold text-[#3B82F6] mb-2 text-sm sm:text-base group-hover:text-[#A855F7] transition-colors">{category.name}</h3>
              <p className="text-xs sm:text-sm text-[#22C55E] group-hover:text-[#16A34A] transition-colors leading-relaxed hidden sm:block">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Styles Section */}
      <section>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#EA580C] bg-clip-text text-transparent">
            热门推荐
          </h2>
          <Link
            to="/gallery"
            className="text-[#3B82F6] hover:text-[#2563EB] font-medium flex items-center transition-colors"
          >
            查看全部
            <ArrowRight className="ml-1" size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {popularStyles.map((style) => (
            <Link
              key={style.id}
              to={`/preview/${style.id}`}
              className="group bg-gradient-to-br from-white to-[#FEF3F2] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={style.thumbnailUrl}
                  alt={style.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><defs><linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#F0F9FF;stop-opacity:1" /><stop offset="100%" style="stop-color:#ECFDF5;stop-opacity:1" /></linearGradient></defs><rect width="300" height="225" fill="url(#bgGrad)"/><text x="150" y="120" text-anchor="middle" fill="#3B82F6" font-size="18">${style.name}</text></svg>`
                    )}`;
                  }}
                />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-[#3B82F6] mb-2 group-hover:text-[#A855F7] transition-colors text-sm sm:text-base">
                  {style.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {style.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-xs rounded-full shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}