
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, Settings, CreditCard, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ReceiptText size={20} /> },
    { name: 'Budgets', path: '/budgets', icon: <CreditCard size={20} /> },
    { name: 'Reports', path: '/reports', icon: <PieChart size={20} /> },
    { name: 'Goals', path: '/goals', icon: <TrendingUp size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar transition-all duration-300 shadow-md z-20",
        isOpen ? "w-64" : "w-0 md:w-16"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-16 px-4">
          {isOpen ? (
            <h1 className="text-xl font-bold text-primary">SmartSpend</h1>
          ) : (
            <span className="text-2xl font-bold text-primary md:block hidden">S</span>
          )}
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-2 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  !isOpen && "justify-center md:block hidden"
                )
              }
            >
              <div className="flex items-center">
                <span className="flex items-center justify-center">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.name}</span>}
              </div>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
