import { Link, useLocation } from 'react-router-dom';
import { Search, Home, Image, Printer, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useAppStore();

  const navItems = [
    { path: '/', label: '主页', icon: Home },
    { path: '/gallery', label: '样式库', icon: Image },
    { path: '/print-manager', label: '打印管理', icon: Printer },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 min-h-[44px] py-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#A855F7] to-[#9333EA] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">P</span>
            </div>
            <span className="text-lg sm:text-xl font-bold">PaperCraft</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/gallery' && location.pathname.startsWith('/gallery'));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors min-h-[44px] ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#A855F7] to-[#9333EA] text-white' 
                      : 'hover:bg-[#4F46E5]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索纸张样式..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-white text-[#374151] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7] border-2 border-transparent focus:border-[#3B82F6]"
              />
              <Search className="absolute left-3 top-2.5 text-[#3B82F6]" size={18} />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-md hover:bg-[#0284C7] min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#0284C7]">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/gallery' && location.pathname.startsWith('/gallery'));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-md transition-colors min-h-[48px] ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#A855F7] to-[#9333EA] text-white' 
                        : 'hover:bg-[#4F46E5]'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索纸张样式..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-white text-[#374151] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7] border-2 border-transparent focus:border-[#3B82F6] text-base min-h-[48px]"
                  />
                  <Search className="absolute left-3 top-3.5 text-[#3B82F6]" size={18} />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;