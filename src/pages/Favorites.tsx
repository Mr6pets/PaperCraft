import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2, Grid, List, ArrowLeft } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../hooks/useAuth'
import { getStyleById } from '../services/dataService'
import type { Style } from '../types'

const Favorites = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { user } = useAuth()
  const { favorites, loading, removeFavorite, clearFavorites, getFavoritesByCategory } = useFavorites()

  // 获取所有分类
  const categories = Array.from(new Set(favorites.map(fav => fav.style_category)))

  // 过滤收藏
  const filteredFavorites = selectedCategory === 'all' 
    ? favorites 
    : getFavoritesByCategory(selectedCategory)

  const handleRemoveFavorite = async (styleId: string) => {
    await removeFavorite(styleId)
  }

  const handleClearAll = async () => {
    if (window.confirm('确定要清空所有收藏吗？此操作不可撤销。')) {
      await clearFavorites()
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto mb-4 text-gray-400" size={64} />
        <h2 className="text-2xl font-bold text-[#1E293B] mb-2">请先登录</h2>
        <p className="text-[#64748B] mb-6">登录后即可查看您的收藏列表</p>
        <Link
          to="/auth"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white rounded-lg hover:from-[#0284C7] hover:to-[#059669] transition-all duration-300"
        >
          立即登录
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0EA5E9]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/gallery"
            className="flex items-center text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
          >
            <ArrowLeft className="mr-2" size={18} />
            <span className="text-sm sm:text-base">返回样式库</span>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">我的收藏</h1>
            <p className="text-[#64748B] text-sm sm:text-base">
              共 {favorites.length} 个收藏样式
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <Trash2 className="mr-1" size={16} />
              清空收藏
            </button>
          )}
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0EA5E9] shadow-sm'
                  : 'text-gray-600 hover:text-[#0EA5E9]'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-[#0EA5E9] shadow-sm'
                  : 'text-gray-600 hover:text-[#0EA5E9]'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-xl font-semibold text-[#1E293B] mb-2">暂无收藏</h2>
          <p className="text-[#64748B] mb-6">去样式库发现喜欢的样式并收藏吧！</p>
          <Link
            to="/gallery"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white rounded-lg hover:from-[#0284C7] hover:to-[#059669] transition-all duration-300"
          >
            浏览样式库
          </Link>
        </div>
      ) : (
        <>
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#0EA5E9] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部 ({favorites.length})
              </button>
              {categories.map(category => {
                const count = getFavoritesByCategory(category).length
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#0EA5E9] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category} ({count})
                  </button>
                )
              })}
            </div>
          )}

          {/* Favorites Grid/List */}
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {filteredFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group ${
                  viewMode === 'list' ? 'flex items-center p-4' : ''
                }`}
              >
                <Link
                  to={`/preview/${favorite.style_id}`}
                  className={`block ${
                    viewMode === 'list' ? 'flex items-center flex-1' : ''
                  }`}
                >
                  <div className={`${
                    viewMode === 'grid'
                      ? 'aspect-[4/3]'
                      : 'w-24 h-18 flex-shrink-0'
                  } overflow-hidden relative ${
                    viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-lg'
                  }`}>
                    <img
                      src={`https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(favorite.style_name)}&image_size=square`}
                      alt={favorite.style_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `data:image/svg+xml,${encodeURIComponent(
                          `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="225" viewBox="0 0 300 225"><rect width="300" height="225" fill="#F8FAFC"/><text x="150" y="120" text-anchor="middle" fill="#0EA5E9" font-size="16">${favorite.style_name}</text></svg>`
                        )}`
                      }}
                    />
                  </div>
                  
                  <div className={`${
                    viewMode === 'grid' ? 'p-4' : 'ml-4 flex-1'
                  }`}>
                    <h3 className="font-semibold text-[#1E293B] group-hover:text-[#0EA5E9] transition-colors">
                      {favorite.style_name}
                    </h3>
                    <p className="text-sm text-[#64748B] mt-1">
                      {favorite.style_category}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-2">
                      收藏于 {new Date(favorite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFavorite(favorite.style_id)}
                  className={`text-red-500 hover:text-red-700 transition-colors ${
                    viewMode === 'grid'
                      ? 'absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100'
                      : 'p-2 ml-2'
                  }`}
                  title="移除收藏"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Favorites