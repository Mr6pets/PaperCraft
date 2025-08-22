import React from 'react';

interface StyleIconProps {
  styleId: string;
  className?: string;
}

export const StyleIcon: React.FC<StyleIconProps> = ({ styleId, className = 'w-full h-full' }) => {
  const getIconSVG = (id: string) => {
    switch (id) {
      // 练字类样式图标
      case 'tian-zi-ge':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="tianzi-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EBF8FF" />
                <stop offset="100%" stopColor="#E0F2FE" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#tianzi-bg)" rx="8" />
            <rect x="20" y="20" width="80" height="80" fill="none" stroke="#3B82F6" strokeWidth="3" />
            <line x1="60" y1="20" x2="60" y2="100" stroke="#60A5FA" strokeWidth="2" />
            <line x1="20" y1="60" x2="100" y2="60" stroke="#60A5FA" strokeWidth="2" />
            <text x="60" y="110" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold">田</text>
          </svg>
        );
      
      case 'mi-zi-ge':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="mizi-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0FDF4" />
                <stop offset="100%" stopColor="#ECFDF5" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#mizi-bg)" rx="8" />
            <rect x="20" y="20" width="80" height="80" fill="none" stroke="#10B981" strokeWidth="3" />
            <line x1="60" y1="20" x2="60" y2="100" stroke="#34D399" strokeWidth="2" />
            <line x1="20" y1="60" x2="100" y2="60" stroke="#34D399" strokeWidth="2" />
            <line x1="20" y1="20" x2="100" y2="100" stroke="#6EE7B7" strokeWidth="1.5" />
            <line x1="100" y1="20" x2="20" y2="100" stroke="#6EE7B7" strokeWidth="1.5" />
            <text x="60" y="110" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="bold">米</text>
          </svg>
        );
      
      case 'jiu-gong-ge':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="jiugong-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF5FF" />
                <stop offset="100%" stopColor="#F3E8FF" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#jiugong-bg)" rx="8" />
            <rect x="15" y="15" width="90" height="90" fill="none" stroke="#8B5CF6" strokeWidth="3" />
            <line x1="45" y1="15" x2="45" y2="105" stroke="#A78BFA" strokeWidth="2" />
            <line x1="75" y1="15" x2="75" y2="105" stroke="#A78BFA" strokeWidth="2" />
            <line x1="15" y1="45" x2="105" y2="45" stroke="#A78BFA" strokeWidth="2" />
            <line x1="15" y1="75" x2="105" y2="75" stroke="#A78BFA" strokeWidth="2" />
            <text x="60" y="113" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">九宫</text>
          </svg>
        );
      
      case 'english-four-line':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="fourline-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF7ED" />
                <stop offset="100%" stopColor="#FFEDD5" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#fourline-bg)" rx="8" />
            <line x1="15" y1="30" x2="105" y2="30" stroke="#F97316" strokeWidth="3" />
            <line x1="15" y1="50" x2="105" y2="50" stroke="#FB923C" strokeWidth="2" strokeDasharray="3,2" />
            <line x1="15" y1="70" x2="105" y2="70" stroke="#FB923C" strokeWidth="2" strokeDasharray="3,2" />
            <line x1="15" y1="90" x2="105" y2="90" stroke="#F97316" strokeWidth="3" />
            <text x="60" y="108" textAnchor="middle" fill="#C2410C" fontSize="10" fontWeight="bold">Abc</text>
          </svg>
        );
      
      case 'math-grid':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="math-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDF2F8" />
                <stop offset="100%" stopColor="#FCE7F3" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#math-bg)" rx="8" />
            {/* 网格线 */}
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i}>
                <line x1={15 + i * 12} y1="15" x2={15 + i * 12} y2="105" stroke="#EC4899" strokeWidth="1" />
                <line x1="15" y1={15 + i * 12} x2="105" y2={15 + i * 12} stroke="#EC4899" strokeWidth="1" />
              </g>
            ))}
            <text x="60" y="113" textAnchor="middle" fill="#BE185D" fontSize="12" fontWeight="bold">±</text>
          </svg>
        );
      
      // 线条类样式图标
      case 'horizontal-lines':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="horizontal-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0FDFA" />
                <stop offset="100%" stopColor="#CCFBF1" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#horizontal-bg)" rx="8" />
            <line x1="15" y1="25" x2="105" y2="25" stroke="#06B6D4" strokeWidth="2" />
            <line x1="15" y1="40" x2="105" y2="40" stroke="#06B6D4" strokeWidth="2" />
            <line x1="15" y1="55" x2="105" y2="55" stroke="#06B6D4" strokeWidth="2" />
            <line x1="15" y1="70" x2="105" y2="70" stroke="#06B6D4" strokeWidth="2" />
            <line x1="15" y1="85" x2="105" y2="85" stroke="#06B6D4" strokeWidth="2" />
            <text x="60" y="108" textAnchor="middle" fill="#0891B2" fontSize="10" fontWeight="bold">横线</text>
          </svg>
        );
      
      case 'vertical-lines':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="vertical-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDF4FF" />
                <stop offset="100%" stopColor="#FAE8FF" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#vertical-bg)" rx="8" />
            <line x1="25" y1="15" x2="25" y2="95" stroke="#D946EF" strokeWidth="2" />
            <line x1="40" y1="15" x2="40" y2="95" stroke="#D946EF" strokeWidth="2" />
            <line x1="55" y1="15" x2="55" y2="95" stroke="#D946EF" strokeWidth="2" />
            <line x1="70" y1="15" x2="70" y2="95" stroke="#D946EF" strokeWidth="2" />
            <line x1="85" y1="15" x2="85" y2="95" stroke="#D946EF" strokeWidth="2" />
            <text x="60" y="108" textAnchor="middle" fill="#A21CAF" fontSize="10" fontWeight="bold">竖线</text>
          </svg>
        );
      
      case 'cross-lines':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="cross-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0FDFA" />
                <stop offset="100%" stopColor="#CCFBF1" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#cross-bg)" rx="8" />
            {/* 横线 */}
            <line x1="15" y1="30" x2="105" y2="30" stroke="#14B8A6" strokeWidth="2" />
            <line x1="15" y1="50" x2="105" y2="50" stroke="#14B8A6" strokeWidth="2" />
            <line x1="15" y1="70" x2="105" y2="70" stroke="#14B8A6" strokeWidth="2" />
            <line x1="15" y1="90" x2="105" y2="90" stroke="#14B8A6" strokeWidth="2" />
            {/* 竖线 */}
            <line x1="30" y1="15" x2="30" y2="95" stroke="#14B8A6" strokeWidth="2" />
            <line x1="50" y1="15" x2="50" y2="95" stroke="#14B8A6" strokeWidth="2" />
            <line x1="70" y1="15" x2="70" y2="95" stroke="#14B8A6" strokeWidth="2" />
            <line x1="90" y1="15" x2="90" y2="95" stroke="#14B8A6" strokeWidth="2" />
            <text x="60" y="108" textAnchor="middle" fill="#0F766E" fontSize="10" fontWeight="bold">十字</text>
          </svg>
        );
      
      // 边框类样式图标
      case 'simple-border':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="border-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF2F2" />
                <stop offset="100%" stopColor="#FEE2E2" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#border-bg)" rx="8" />
            <rect x="20" y="20" width="80" height="70" fill="none" stroke="#EF4444" strokeWidth="3" rx="4" />
            <text x="60" y="108" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold">边框</text>
          </svg>
        );
      
      case 'double-border':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="double-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#double-bg)" rx="8" />
            <rect x="15" y="15" width="90" height="75" fill="none" stroke="#F59E0B" strokeWidth="2" rx="4" />
            <rect x="20" y="20" width="80" height="65" fill="none" stroke="#F59E0B" strokeWidth="2" rx="4" />
            <text x="60" y="108" textAnchor="middle" fill="#D97706" fontSize="10" fontWeight="bold">双框</text>
          </svg>
        );
      
      case 'corner-frame':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="corner-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0F9FF" />
                <stop offset="100%" stopColor="#E0F2FE" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#corner-bg)" rx="8" />
            {/* 角落装饰 */}
            <path d="M20 20 L35 20 L35 25 L25 25 L25 35 L20 35 Z" fill="#6366F1" />
            <path d="M100 20 L85 20 L85 25 L95 25 L95 35 L100 35 Z" fill="#6366F1" />
            <path d="M20 90 L35 90 L35 85 L25 85 L25 75 L20 75 Z" fill="#6366F1" />
            <path d="M100 90 L85 90 L85 85 L95 85 L95 75 L100 75 Z" fill="#6366F1" />
            <text x="60" y="108" textAnchor="middle" fill="#4338CA" fontSize="10" fontWeight="bold">角框</text>
          </svg>
        );
      
      // 技术类样式图标
      case 'engineering-grid':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="eng-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F7FEE7" />
                <stop offset="100%" stopColor="#ECFCCB" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#eng-bg)" rx="8" />
            {/* 精密网格 */}
            {Array.from({ length: 10 }, (_, i) => (
              <g key={i}>
                <line x1={15 + i * 9} y1="15" x2={15 + i * 9} y2="95" stroke="#84CC16" strokeWidth="0.8" />
                <line x1="15" y1={15 + i * 9} x2="105" y2={15 + i * 9} stroke="#84CC16" strokeWidth="0.8" />
              </g>
            ))}
            <circle cx="60" cy="55" r="3" fill="#65A30D" />
            <text x="60" y="108" textAnchor="middle" fill="#4D7C0F" fontSize="9" fontWeight="bold">工程</text>
          </svg>
        );
      
      case 'isometric-grid':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="iso-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="100%" stopColor="#FFE4E6" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#iso-bg)" rx="8" />
            {/* 等轴测网格 */}
            <g stroke="#F43F5E" strokeWidth="1.5" fill="none">
              <path d="M30 25 L60 15 L90 25 L90 55 L60 65 L30 55 Z" />
              <path d="M30 45 L60 35 L90 45 L90 75 L60 85 L30 75 Z" />
              <line x1="30" y1="25" x2="30" y2="75" />
              <line x1="60" y1="15" x2="60" y2="85" />
              <line x1="90" y1="25" x2="90" y2="75" />
            </g>
            <text x="60" y="108" textAnchor="middle" fill="#E11D48" fontSize="9" fontWeight="bold">3D</text>
          </svg>
        );
      
      case 'circuit-diagram':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="circuit-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0FDFA" />
                <stop offset="100%" stopColor="#CCFBF1" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#circuit-bg)" rx="8" />
            {/* 电路元件 */}
            <g stroke="#06B6D4" strokeWidth="2" fill="none">
              <rect x="25" y="35" width="20" height="10" />
              <rect x="75" y="35" width="20" height="10" />
              <circle cx="60" cy="60" r="8" />
              <line x1="15" y1="40" x2="25" y2="40" />
              <line x1="45" y1="40" x2="75" y2="40" />
              <line x1="95" y1="40" x2="105" y2="40" />
              <line x1="60" y1="45" x2="60" y2="52" />
              <line x1="60" y1="68" x2="60" y2="80" />
            </g>
            <text x="60" y="108" textAnchor="middle" fill="#0891B2" fontSize="9" fontWeight="bold">电路</text>
          </svg>
        );
      
      // 表格类样式图标
      case 'basic-table':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="table-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF5FF" />
                <stop offset="100%" stopColor="#F3E8FF" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#table-bg)" rx="8" />
            <g stroke="#8B5CF6" strokeWidth="2" fill="none">
              <rect x="20" y="25" width="80" height="60" />
              <line x1="20" y1="40" x2="100" y2="40" />
              <line x1="20" y1="55" x2="100" y2="55" />
              <line x1="20" y1="70" x2="100" y2="70" />
              <line x1="45" y1="25" x2="45" y2="85" />
              <line x1="75" y1="25" x2="75" y2="85" />
            </g>
            <text x="60" y="105" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">表格</text>
          </svg>
        );
      
      case 'ledger-lines':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="ledger-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ECFDF5" />
                <stop offset="100%" stopColor="#D1FAE5" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#ledger-bg)" rx="8" />
            <g stroke="#10B981" strokeWidth="1.5">
              <line x1="15" y1="25" x2="105" y2="25" />
              <line x1="15" y1="40" x2="105" y2="40" />
              <line x1="15" y1="55" x2="105" y2="55" />
              <line x1="15" y1="70" x2="105" y2="70" />
              <line x1="15" y1="85" x2="105" y2="85" />
              <line x1="75" y1="20" x2="75" y2="90" strokeWidth="2" />
            </g>
            <text x="60" y="108" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">账本</text>
          </svg>
        );
      
      case 'checklist-template':
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <defs>
              <linearGradient id="check-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDF2F8" />
                <stop offset="100%" stopColor="#FCE7F3" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" fill="url(#check-bg)" rx="8" />
            <g stroke="#EC4899" strokeWidth="1.5" fill="none">
              <rect x="20" y="25" width="8" height="8" />
              <rect x="20" y="40" width="8" height="8" />
              <rect x="20" y="55" width="8" height="8" />
              <rect x="20" y="70" width="8" height="8" />
              <line x1="35" y1="29" x2="95" y2="29" />
              <line x1="35" y1="44" x2="95" y2="44" />
              <line x1="35" y1="59" x2="95" y2="59" />
              <line x1="35" y1="74" x2="95" y2="74" />
            </g>
            <path d="M22 27 L24 29 L26 26" stroke="#EC4899" strokeWidth="2" fill="none" />
            <text x="60" y="105" textAnchor="middle" fill="#BE185D" fontSize="10" fontWeight="bold">清单</text>
          </svg>
        );
      
      default:
        return (
          <svg viewBox="0 0 120 120" className={className}>
            <rect width="120" height="120" fill="#F3F4F6" rx="8" />
            <text x="60" y="60" textAnchor="middle" fill="#6B7280" fontSize="14">?</text>
          </svg>
        );
    }
  };

  return getIconSVG(styleId);
};

export default StyleIcon;