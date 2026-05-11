'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/memorization', label: 'الحفظ' },
    { href: '/listeners', label: 'الاستماع' },
    { href: '/downloads', label: 'التحميل' },
    { href: '/dashboard', label: 'لوحتي' },
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

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-4">
            <button className="px-4 py-2 rounded-lg hover:bg-white hover:text-islamic-dark transition-colors">
              دخول
            </button>
            <button className="px-4 py-2 bg-islamic-secondary text-islamic-dark rounded-lg font-bold hover:bg-opacity-90 transition-colors">
              إنشاء حساب
            </button>
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
                className="block px-4 py-2 hover:bg-islamic-secondary hover:text-islamic-dark rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-white">
              <button className="w-full px-4 py-2 rounded-lg hover:bg-white hover:text-islamic-dark transition-colors">
                دخول
              </button>
              <button className="w-full px-4 py-2 bg-islamic-secondary text-islamic-dark rounded-lg font-bold">
                إنشاء حساب
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
