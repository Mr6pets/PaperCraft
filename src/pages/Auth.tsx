import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

type AuthMode = 'login' | 'register' | 'reset'

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'login') {
        const { data } = await signIn(email, password)
        if (data?.session) {
          navigate('/')
        }
      } else if (mode === 'register') {
        await signUp(email, password, username)
      } else if (mode === 'reset') {
        await resetPassword(email)
        setMode('login')
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setUsername('')
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] to-[#ECFDF5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-[#0EA5E9] mb-2 block">
            PaperCraft
          </Link>
          <h2 className="text-xl font-semibold text-[#1E293B]">
            {mode === 'login' && '登录账户'}
            {mode === 'register' && '创建账户'}
            {mode === 'reset' && '重置密码'}
          </h2>
          <p className="text-[#64748B] text-sm mt-2">
            {mode === 'login' && '欢迎回来！请登录您的账户'}
            {mode === 'register' && '创建账户以保存您的偏好设置'}
            {mode === 'reset' && '输入邮箱地址以重置密码'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              邮箱地址
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                placeholder="输入您的邮箱"
                required
              />
            </div>
          </div>

          {/* Username (只在注册时显示) */}
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                  placeholder="输入用户名"
                />
              </div>
            </div>
          )}

          {/* Password (不在重置密码时显示) */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                  placeholder="输入密码"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#10B981] text-white py-3 rounded-lg font-medium hover:from-[#0284C7] hover:to-[#059669] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : (
              mode === 'login' ? '登录' :
              mode === 'register' ? '注册' : '发送重置邮件'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          {mode === 'login' && (
            <>
              <button
                onClick={() => switchMode('reset')}
                className="text-[#0EA5E9] hover:underline text-sm"
              >
                忘记密码？
              </button>
              <div className="text-[#64748B] text-sm">
                还没有账户？{' '}
                <button
                  onClick={() => switchMode('register')}
                  className="text-[#0EA5E9] hover:underline font-medium"
                >
                  立即注册
                </button>
              </div>
            </>
          )}

          {mode === 'register' && (
            <div className="text-[#64748B] text-sm">
              已有账户？{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-[#0EA5E9] hover:underline font-medium"
              >
                立即登录
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <div className="text-[#64748B] text-sm">
              记起密码了？{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-[#0EA5E9] hover:underline font-medium"
              >
                返回登录
              </button>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <Link
            to="/"
            className="text-[#64748B] hover:text-[#0EA5E9] text-sm transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Auth