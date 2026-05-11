'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, Settings, User, Search, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/memorization', label: 'الحفظ' },
    { href: '/listeners', label: 'الاستماع' },
    { href: '/downloads', label: 'التحميل' },
    { href: '/search', label: 'البحث', icon: Search },
    { href: '/community', label: 'المجتمع' },
    { href: '/leaderboard', label: 'الترتيب' },
    { href: '/dashboard', label: 'لوحتي' },
  ];

  const userMenuLinks = [
    { href: '/profile', label: 'الملف الشخصي', icon: User },
    { href: '/settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <header className="bg-gradient-to-r from-islamic-primary to-islamic-dark text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-islamic-secondary rounded-full flex items-center justify-center">
              <span className="text-islamic-dark font-bold">ق</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">منصة القرآن</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-islamic-secondary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <img
                    src={user.avatar_url || 'https://via.placeholder.com/32'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{user.full_name}</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 text-gray-900">
                    {userMenuLinks.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <IconComponent size={18} />
                          {link.label}
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut size={18} />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg hover:bg-white hover:text-islamic-dark transition-colors"
                >
                  دخول
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-islamic-secondary text-islamic-dark rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 hover:bg-islamic-secondary hover:text-islamic-dark rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.icon && <link.icon size={18} />}
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                <div className="pt-4 border-t border-white">
                  <div className="px-4 py-2 text-sm font-semibold">{user.full_name}</div>
                </div>
                {userMenuLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-islamic-secondary hover:text-islamic-dark rounded transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <IconComponent size={18} />
                      {link.label}
                    </Link>
                  );
                })}
              </>
            )}

            <div className={`pt-4 space-y-2 ${user ? 'border-t border-white' : ''}`}>
              {!user && (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 rounded-lg hover:bg-white hover:text-islamic-dark transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    دخول
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-2 bg-islamic-secondary text-islamic-dark rounded-lg font-bold hover:bg-opacity-90 transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut size={18} />
                  تسجيل الخروج
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
