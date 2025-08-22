import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'
import type { PrintSettings } from '../types'

export interface PrintHistoryItem {
  id: string
  user_id: string
  style_id: string
  style_name: string
  paper_size: string
  print_settings: PrintSettings
  created_at: string
}

export const usePrintHistory = () => {
  const [printHistory, setPrintHistory] = useState<PrintHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // 获取打印历史
  const fetchPrintHistory = async () => {
    if (!user) {
      setPrintHistory([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('print_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100) // 限制最近100条记录

      if (error) throw error

      setPrintHistory(data || [])
    } catch (error: any) {
      console.error('Error fetching print history:', error)
      toast.error('获取打印历史失败')
    } finally {
      setLoading(false)
    }
  }

  // 添加打印记录
  const addPrintRecord = async (
    styleId: string,
    styleName: string,
    paperSize: string,
    printSettings: PrintSettings
  ) => {
    if (!user) {
      return false
    }

    try {
      const { data, error } = await supabase
        .from('print_history')
        .insert({
          user_id: user.id,
          style_id: styleId,
          style_name: styleName,
          paper_size: paperSize,
          print_settings: printSettings
        })
        .select()
        .single()

      if (error) throw error

      // 添加到本地状态
      setPrintHistory(prev => [data, ...prev.slice(0, 99)]) // 保持最多100条记录
      return true
    } catch (error: any) {
      console.error('Error adding print record:', error)
      return false
    }
  }

  // 删除打印记录
  const deletePrintRecord = async (recordId: string) => {
    if (!user) {
      toast.error('请先登录')
      return false
    }

    try {
      const { error } = await supabase
        .from('print_history')
        .delete()
        .eq('id', recordId)
        .eq('user_id', user.id)

      if (error) throw error

      setPrintHistory(prev => prev.filter(record => record.id !== recordId))
      toast.success('已删除打印记录')
      return true
    } catch (error: any) {
      console.error('Error deleting print record:', error)
      toast.error('删除打印记录失败')
      return false
    }
  }

  // 清空打印历史
  const clearPrintHistory = async () => {
    if (!user) {
      toast.error('请先登录')
      return false
    }

    try {
      const { error } = await supabase
        .from('print_history')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setPrintHistory([])
      toast.success('已清空打印历史')
      return true
    } catch (error: any) {
      console.error('Error clearing print history:', error)
      toast.error('清空打印历史失败')
      return false
    }
  }

  // 获取最近使用的纸张尺寸
  const getRecentPaperSizes = (): string[] => {
    const sizes = printHistory.map(record => record.paper_size)
    return Array.from(new Set(sizes)).slice(0, 5)
  }

  // 获取最近使用的打印设置
  const getRecentPrintSettings = (): PrintSettings[] => {
    return printHistory.slice(0, 5).map(record => record.print_settings)
  }

  // 按日期分组打印历史
  const getGroupedPrintHistory = () => {
    const groups: { [key: string]: PrintHistoryItem[] } = {}
    
    printHistory.forEach(record => {
      const date = new Date(record.created_at).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(record)
    })
    
    return groups
  }

  // 获取打印统计
  const getPrintStats = () => {
    const totalPrints = printHistory.length
    const uniqueStyles = new Set(printHistory.map(record => record.style_id)).size
    const paperSizeStats = printHistory.reduce((acc, record) => {
      acc[record.paper_size] = (acc[record.paper_size] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    const mostUsedPaperSize = Object.entries(paperSizeStats)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'A4'
    
    return {
      totalPrints,
      uniqueStyles,
      paperSizeStats,
      mostUsedPaperSize
    }
  }

  useEffect(() => {
    fetchPrintHistory()
  }, [user])

  return {
    printHistory,
    loading,
    addPrintRecord,
    deletePrintRecord,
    clearPrintHistory,
    getRecentPaperSizes,
    getRecentPrintSettings,
    getGroupedPrintHistory,
    getPrintStats,
    refetch: fetchPrintHistory
  }
}