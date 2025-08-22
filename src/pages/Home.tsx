import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Printer, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { usePrintHistory } from '../hooks/usePrintHistory';
import { Category, Style } from '../types';
import { getCategories, getPopularStyles } from '../services/dataService';
import { useAppStore } from '../store';
import StyleIcon from '../components/StyleIcon';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularStyles, setPopularStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedCategory } = useAppStore();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { printHistory, getPrintStats } = usePrintHistory();
  const printStats = getPrintStats();

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
          <Sparkles className="text-[#0EA5E9] mr-2 sm:mr-3" size={24} />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E293B] leading-tight">
            {user ? `欢迎回来，${user.user_metadata?.display_name || '创作者'}` : 'PaperCraft 纸艺工坊'}
          </h1>
          <Sparkles className="text-[#0EA5E9] ml-2 sm:ml-3" size={24} />
        </div>
        <p className="text-base sm:text-lg md:text-xl text-[#0EA5E9] max-w-3xl mx-auto mb-6 sm:mb-8 px-4 text-center leading-relaxed">
          {user ? (
            `你已收藏 ${favorites.length} 个样式，完成 ${printStats.totalPrints} 次打印。继续探索更多精彩内容！`
          ) : (
            '无需购买各种样式纸张，选择心仪的模板，实时预览效果，一键打印专属装饰纸张'
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/gallery"
            className="inline-flex items-center px-6 sm:px-8 py-3 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] text-[#0EA5E9] rounded-lg hover:from-[#E0F2FE] hover:to-[#D1FAE5] transition-all duration-300 font-medium min-h-[48px] shadow-lg hover:shadow-xl border border-[#0EA5E9]"
          >
            {user ? '继续探索' : '开始探索'}
            <ArrowRight className="ml-2" size={18} />
          </Link>
          {user && (
            <Link
              to="/favorites"
              className="inline-flex items-center px-6 sm:px-8 py-3 border-2 border-[#0EA5E9] text-[#0EA5E9] rounded-lg hover:bg-[#0EA5E9] hover:text-white transition-all duration-300 font-medium min-h-[48px]"
            >
              <Heart className="mr-2" size={18} />
              我的收藏
            </Link>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] mb-6 sm:mb-8 text-center">纸张分类</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/gallery/${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
              className="group bg-gradient-to-br from-[#F0F9FF] to-[#ECFDF5] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 text-center border-2 border-transparent hover:border-[#0EA5E9] hover:scale-105"
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
              <h3 className="font-semibold text-[#0EA5E9] mb-2 text-sm sm:text-base group-hover:text-[#0284C7] transition-colors">{category.name}</h3>
              <p className="text-xs sm:text-sm text-[#10B981] group-hover:text-[#059669] transition-colors leading-relaxed hidden sm:block">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Styles Section */}
      <section>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">
            热门推荐
          </h2>
          <Link
            to="/gallery"
            className="text-[#0EA5E9] hover:text-[#0284C7] font-medium flex items-center transition-colors"
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
              className="group bg-gradient-to-br from-[#F0F9FF] to-[#ECFDF5] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F0F9FF] to-[#ECFDF5] flex items-center justify-center">
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
                        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><defs><linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#F0F9FF;stop-opacity:1" /><stop offset="100%" style="stop-color:#ECFDF5;stop-opacity:1" /></linearGradient></defs><rect width="300" height="225" fill="url(#bgGrad)"/><text x="150" y="120" text-anchor="middle" fill="#3B82F6" font-size="18">${style.name}</text></svg>`
                      )}`;
                    }}
                  />
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-[#0EA5E9] mb-2 group-hover:text-[#0284C7] transition-colors text-sm sm:text-base">
                  {style.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {style.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gradient-to-r from-[#F0F9FF] to-[#ECFDF5] text-[#0EA5E9] text-xs rounded-full shadow-sm border border-[#0EA5E9]"
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