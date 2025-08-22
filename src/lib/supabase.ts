import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jpzlggeexlodxyvfdyos.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwemxnZ2VleGxvZHh5dmZkeW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDI5MzEsImV4cCI6MjA3MTMxODkzMX0.huRZc4gVR43vZJ6vfzylyc4Ty4nBbYUBAMD1F-CEo_I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  style_id: string
  style_name: string
  style_category: string
  created_at: string
}

export interface PrintHistory {
  id: string
  user_id: string
  style_id: string
  style_name: string
  paper_size: string
  print_settings: any
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  default_paper_size: string
  default_print_quality: string
  theme_preference: string
  language: string
  created_at: string
  updated_at: string
}