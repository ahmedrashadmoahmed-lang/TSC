import React from 'react';
import { Icon } from '../shared/Icon';
import type { IconName } from '../../types';

interface NavLinkProps {
  icon: IconName;
  label: string;
  href: string;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, href, isActive }) => {
  return (
    <a
      href={href}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      <Icon name={icon} className="w-6 h-6 ml-4" />
      <span className="font-semibold">{label}</span>
    </a>
  );
};

interface SidebarProps {
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navItems = [
    { icon: 'dashboard' as const, label: 'لوحة القيادة', href: '#dashboard', id: 'dashboard' },
    { icon: 'offers' as const, label: 'عروض الأسعار', href: '#offers', id: 'offers' },
    { icon: 'customers' as const, label: 'العملاء', href: '#customers', id: 'customers' },
    { icon: 'receivable' as const, label: 'حسابات العملاء', href: '#receivable', id: 'receivable' },
    { icon: 'suppliers' as const, label: 'الموردون', href: '#suppliers', id: 'suppliers' },
    { icon: 'purchase-order' as const, label: 'أوامر الشراء', href: '#purchase-orders', id: 'purchase-orders' },
    { icon: 'payable' as const, label: 'حسابات الموردين', href: '#payable', id: 'payable' },
    { icon: 'inventory' as const, label: 'المخزون', href: '#inventory', id: 'inventory' },
    { icon: 'reports' as const, label: 'التقارير', href: '#reports', id: 'reports' },
    { icon: 'settings' as const, label: 'الإعدادات', href: '#settings', id: 'settings' },
  ];

  return (
    <aside className="w-64 bg-white flex flex-col border-l border-slate-200">
        <div className="flex items-center justify-center p-6 border-b border-slate-200 h-[97px]">
            <h1 className="text-2xl font-bold text-indigo-600">محاسبي برو</h1>
        </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={activePage === item.id}
          />
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-100 p-4 rounded-lg text-center">
            <h4 className="font-bold text-slate-800">تحتاج مساعدة؟</h4>
            <p className="text-sm text-slate-500 mt-1">تواصل مع فريق الدعم الفني.</p>
            <button className="mt-3 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                تواصل معنا
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;