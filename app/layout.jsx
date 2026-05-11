'use client';

import { Tajawal, Cairo } from 'next/font/google';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from './lib/store';
import { AuthProvider } from './context/AuthContext';

const tajawal = Tajawal({ subsets: ['arabic'], variable: '--font-tajawal' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata = {
  title: 'منصة حفظ القرآن الكريم',
  description: 'منصة احترافية لتعليم وحفظ القرآن الكريم',
  lang: 'ar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2d5f3f" />
      </head>
      <body className="font-arabic bg-islamic-light text-islamic-dark">
        <Provider store={store}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
