// Navbar.tsx — Top navigation bar
// Design: Modern Agri-Tech Dashboard — sticky nav with green theme

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, TrendingUp, Calculator, BarChart3, BookOpen, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '#/', label: 'หน้าหลัก', icon: Home },
  { href: '#/compare', label: 'เปรียบเทียบพืช', icon: BarChart3 },
  { href: '#/calculator', label: 'คำนวณผลตอบแทน', icon: Calculator },
  { href: '#/trends', label: 'แนวโน้มราคา', icon: TrendingUp },
  { href: '#/guide', label: 'คู่มือการปลูก', icon: BookOpen },
];

export default function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[oklch(0.22_0.06_155)] shadow-lg">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="#/">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663435995365/jNZECRnRB9i5YJLDzEEGai/sugarcane-icon-ZrcfSfaF8jWkvcNbGaYa34.webp"
                  alt="อ้อยทอง"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-white text-lg leading-tight" style={{ fontFamily: 'Prompt, sans-serif' }}>
                  อ้อยทอง
                </div>
                <div className="text-[oklch(0.72_0.14_75)] text-xs leading-tight">ที่ปรึกษาเกษตรกร</div>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location === href
                      ? 'bg-[oklch(0.72_0.14_75)] text-[oklch(0.18_0.04_50)]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-3">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all ${
                    location === href
                      ? 'bg-[oklch(0.72_0.14_75)] text-[oklch(0.18_0.04_50)]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
