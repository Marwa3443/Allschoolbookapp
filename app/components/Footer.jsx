'use client';

import Link from 'next/link';
import { Heart, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-islamic-primary to-islamic-dark text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-islamic-secondary">عن المنصة</h3>
            <p className="text-sm leading-relaxed">
              منصة احترافية مختصة بتعليم وحفظ القرآن الكريم بطرق حديثة وفعّالة تناسب جميع الأعمار.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-islamic-secondary">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-islamic-secondary transition">الرئيسية</Link></li>
              <li><Link href="/memorization" className="hover:text-islamic-secondary transition">نظام الحفظ</Link></li>
              <li><Link href="/listeners" className="hover:text-islamic-secondary transition">القراء المشهورين</Link></li>
              <li><Link href="/about" className="hover:text-islamic-secondary transition">عن الموقع</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-islamic-secondary">تواصل معنا</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 hover:text-islamic-secondary transition">
                <Mail size={18} />
                <a href="mailto:info@quranapp.com">info@quranapp.com</a>
              </div>
              <div className="flex items-center gap-2 hover:text-islamic-secondary transition">
                <Phone size={18} />
                <a href="tel:+966123456789">+966 12 345 6789</a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-islamic-secondary opacity-30 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="flex items-center gap-1">
            تم بناء هذا الموقع بـ <Heart size={16} className="text-islamic-secondary" /> لنشر القرآن الكريم
          </p>
          <p className="text-xs mt-4 md:mt-0">
            © {currentYear} منصة القرآن الكريم. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
