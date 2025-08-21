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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="text-[#FFD700] mr-3" size={32} />
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D5A27]">
            PaperCraft 纸艺工坊
          </h1>
          <Sparkles className="text-[#FFD700] ml-3" size={32} />
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          无需购买各种样式纸张，选择心仪的模板，实时预览效果，一键打印专属装饰纸张
        </p>
        <Link
          to="/gallery"
          className="inline-flex items-center px-8 py-3 bg-[#2D5A27] text-white rounded-lg hover:bg-[#3D6A37] transition-colors font-medium"
        >
          开始探索
          <ArrowRight className="ml-2" size={20} />
        </Link>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-[#2D5A27] mb-8 text-center">
          纸张分类
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/gallery/${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
              className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center border-2 border-transparent hover:border-[#FFD700]"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={category.iconUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,${encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2D5A27"/><text x="32" y="38" text-anchor="middle" fill="white" font-size="24">${category.name[0]}</text></svg>`
                    )}`;
                  }}
                />
              </div>
              <h3 className="font-semibold text-[#2D5A27] mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Styles Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#2D5A27]">
            热门推荐
          </h2>
          <Link
            to="/gallery"
            className="text-[#2D5A27] hover:text-[#3D6A37] font-medium flex items-center"
          >
            查看全部
            <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularStyles.map((style) => (
            <Link
              key={style.id}
              to={`/preview/${style.id}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
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
                <div className="flex flex-wrap gap-1">
                  {style.tags.slice(0, 3).map((tag) => (
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
      </section>
    </div>
  );
}