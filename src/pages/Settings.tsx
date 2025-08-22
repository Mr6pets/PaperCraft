import { useState, useEffect } from 'react';
import { User, Settings as SettingsIcon, Bell, Shield, Palette, Printer, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface UserSettings {
  id?: string;
  user_id: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
  notifications_enabled: boolean;
  default_paper_size: string;
  default_print_quality: 'draft' | 'normal' | 'high';
  auto_save_favorites: boolean;
  privacy_mode: boolean;
  created_at?: string;
  updated_at?: string;
}

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    display_name: '',
    email: '',
    avatar_url: ''
  });
  
  // Settings form state
  const [settingsForm, setSettingsForm] = useState<UserSettings>({
    user_id: '',
    theme: 'light' as const,
    language: 'zh' as const,
    notifications_enabled: true,
    default_paper_size: 'A4',
    default_print_quality: 'normal' as const,
    auto_save_favorites: true,
    privacy_mode: false
  });
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      // Load user profile
      setProfileForm({
        display_name: user.user_metadata?.display_name || '',
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url || ''
      });
      
      // Load user settings
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }
      
      if (data) {
        setSettingsForm(data);
      } else {
        // Create default settings if none exist
        const defaultSettings = {
          ...settingsForm,
          user_id: user.id
        };
        
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert([defaultSettings]);
        
        if (insertError) {
          console.error('Error creating default settings:', insertError);
        }
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Update user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          display_name: profileForm.display_name,
          avatar_url: profileForm.avatar_url
        }
      });
      
      if (authError) throw authError;
      
      // Update user profile in database
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          username: profileForm.display_name,
          avatar_url: profileForm.avatar_url,
          updated_at: new Date().toISOString()
        });
      
      if (profileError) throw profileError;
      
      toast.success('个人信息更新成功');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          ...settingsForm,
          user_id: user.id,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success('设置保存成功');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('新密码与确认密码不匹配');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('密码长度至少为6位');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) throw error;
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('密码修改成功');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('密码修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <SettingsIcon className="mx-auto mb-4 text-gray-400" size={64} />
        <h2 className="text-xl font-semibold text-[#1E293B] mb-2">请先登录</h2>
        <p className="text-[#64748B] mb-6">登录后即可访问个人设置</p>
        <a
          href="/auth"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white rounded-lg hover:from-[#0284C7] hover:to-[#059669] transition-all duration-300"
        >
          立即登录
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">个人设置</h1>
        <p className="text-[#64748B] text-sm sm:text-base">
          管理您的个人信息和应用偏好
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-white text-[#0EA5E9] shadow-sm'
              : 'text-gray-600 hover:text-[#0EA5E9]'
          }`}
        >
          <User className="mr-2" size={16} />
          个人信息
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'preferences'
              ? 'bg-white text-[#0EA5E9] shadow-sm'
              : 'text-gray-600 hover:text-[#0EA5E9]'
          }`}
        >
          <Palette className="mr-2" size={16} />
          偏好设置
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'security'
              ? 'bg-white text-[#0EA5E9] shadow-sm'
              : 'text-gray-600 hover:text-[#0EA5E9]'
          }`}
        >
          <Shield className="mr-2" size={16} />
          账户安全
        </button>
      </div>

      {/* Content */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#1E293B] mb-4">个人信息</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                显示名称
              </label>
              <input
                type="text"
                value={profileForm.display_name}
                onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                placeholder="请输入显示名称"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={profileForm.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-[#64748B] mt-1">邮箱地址无法修改</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                头像URL
              </label>
              <input
                type="url"
                value={profileForm.avatar_url}
                onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                placeholder="请输入头像URL"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="mr-2" size={16} />
              {loading ? '保存中...' : '保存更改'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#1E293B] mb-4">偏好设置</h2>
          <form onSubmit={handleSettingsUpdate} className="space-y-6">
            {/* Theme Settings */}
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                主题设置
              </label>
              <select
                value={settingsForm.theme}
                onChange={(e) => setSettingsForm({ ...settingsForm, theme: e.target.value as 'light' | 'dark' | 'auto' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
              >
                <option value="light">浅色主题</option>
                <option value="dark">深色主题</option>
                <option value="auto">跟随系统</option>
              </select>
            </div>
            
            {/* Language Settings */}
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                语言设置
              </label>
              <select
                value={settingsForm.language}
                onChange={(e) => setSettingsForm({ ...settingsForm, language: e.target.value as 'zh' | 'en' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
            
            {/* Print Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  默认纸张尺寸
                </label>
                <select
                  value={settingsForm.default_paper_size}
                  onChange={(e) => setSettingsForm({ ...settingsForm, default_paper_size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  默认打印质量
                </label>
                <select
                  value={settingsForm.default_print_quality}
                  onChange={(e) => setSettingsForm({ ...settingsForm, default_print_quality: e.target.value as 'draft' | 'normal' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                >
                  <option value="draft">草稿质量</option>
                  <option value="normal">标准质量</option>
                  <option value="high">高质量</option>
                </select>
              </div>
            </div>
            
            {/* Toggle Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-[#1E293B]">通知设置</h3>
                  <p className="text-xs text-[#64748B]">接收应用通知和更新提醒</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.notifications_enabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, notifications_enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0EA5E9]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0EA5E9]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-[#1E293B]">自动保存收藏</h3>
                  <p className="text-xs text-[#64748B]">自动保存您喜欢的样式</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.auto_save_favorites}
                    onChange={(e) => setSettingsForm({ ...settingsForm, auto_save_favorites: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0EA5E9]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0EA5E9]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-[#1E293B]">隐私模式</h3>
                  <p className="text-xs text-[#64748B]">隐藏个人使用统计信息</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.privacy_mode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, privacy_mode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0EA5E9]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0EA5E9]"></div>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-[#0284C7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="mr-2" size={16} />
              {loading ? '保存中...' : '保存设置'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#1E293B] mb-4">账户安全</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                当前密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                  placeholder="请输入当前密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                新密码
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                placeholder="请输入新密码（至少6位）"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                确认新密码
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                placeholder="请再次输入新密码"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="mr-2" size={16} />
              {loading ? '修改中...' : '修改密码'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;