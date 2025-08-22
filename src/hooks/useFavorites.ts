import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'
import type { Style } from '../types'

export interface Favorite {
  id: string
  user_id: string
  style_id: string
  style_name: string
  style_category: string
  created_at: string
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // 获取用户收藏列表
  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setFavorites(data || [])
    } catch (error: any) {
      console.error('Error fetching favorites:', error)
      toast.error('获取收藏列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 检查样式是否已收藏
  const isFavorite = (styleId: string): boolean => {
    return favorites.some(fav => fav.style_id === styleId)
  }

  // 添加收藏
  const addFavorite = async (style: Style) => {
    if (!user) {
      toast.error('请先登录')
      return false
    }

    if (isFavorite(style.id)) {
      toast.info('已在收藏列表中')
      return false
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          style_id: style.id,
          style_name: style.name,
          style_category: style.categoryId
        })
        .select()
        .single()

      if (error) throw error

      setFavorites(prev => [data, ...prev])
      toast.success('已添加到收藏')
      return true
    } catch (error: any) {
      console.error('Error adding favorite:', error)
      toast.error('添加收藏失败')
      return false
    }
  }

  // 移除收藏
  const removeFavorite = async (styleId: string) => {
    if (!user) {
      toast.error('请先登录')
      return false
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('style_id', styleId)

      if (error) throw error

      setFavorites(prev => prev.filter(fav => fav.style_id !== styleId))
      toast.success('已从收藏中移除')
      return true
    } catch (error: any) {
      console.error('Error removing favorite:', error)
      toast.error('移除收藏失败')
      return false
    }
  }

  // 切换收藏状态
  const toggleFavorite = async (style: Style) => {
    if (isFavorite(style.id)) {
      return await removeFavorite(style.id)
    } else {
      return await addFavorite(style)
    }
  }

  // 清空所有收藏
  const clearFavorites = async () => {
    if (!user) {
      toast.error('请先登录')
      return false
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setFavorites([])
      toast.success('已清空收藏列表')
      return true
    } catch (error: any) {
      console.error('Error clearing favorites:', error)
      toast.error('清空收藏失败')
      return false
    }
  }

  // 获取收藏数量
  const getFavoriteCount = (): number => {
    return favorites.length
  }

  // 按分类获取收藏
  const getFavoritesByCategory = (categoryId: string): Favorite[] => {
    return favorites.filter(fav => fav.style_category === categoryId)
  }

  useEffect(() => {
    fetchFavorites()
  }, [user])

  return {
    favorites,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoriteCount,
    getFavoritesByCategory,
    refetch: fetchFavorites
  }
}