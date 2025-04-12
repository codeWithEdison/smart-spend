
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, Settings, CreditCard, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  // We'll use a subset of the main navigation items to avoid overcrowding
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ReceiptText size={20} /> },
    { name: 'Budgets', path: '/budgets', icon: <CreditCard size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-border z-30 md:hidden">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-md transition-colors w-full h-full",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )
            }
          >
            <span className="flex items-center justify-center">{item.icon}</span>
            <span className="text-xs mt-1">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;
