import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  useEffect(() => {
    // 获取初始会话
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      }
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false
      })
    }

    getInitialSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false
        })

        if (event === 'SIGNED_IN') {
          toast.success('登录成功！')
        } else if (event === 'SIGNED_OUT') {
          toast.success('已退出登录')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      })

      if (error) throw error

      if (data.user && !data.session) {
        toast.success('注册成功！请检查邮箱验证链接')
      }

      return { data, error: null }
    } catch (error: any) {
      toast.error(error.message || '注册失败')
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      toast.error(error.message || '登录失败')
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || '退出登录失败')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      toast.success('密码重置邮件已发送')
      return { error: null }
    } catch (error: any) {
      toast.error(error.message || '发送重置邮件失败')
      return { error }
    }
  }

  const updateProfile = async (updates: { username?: string; avatar_url?: string }) => {
    try {
      if (!authState.user) throw new Error('用户未登录')

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: authState.user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('个人资料更新成功')
      return { error: null }
    } catch (error: any) {
      toast.error(error.message || '更新个人资料失败')
      return { error }
    }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  }
}