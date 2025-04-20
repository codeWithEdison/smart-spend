
import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, Settings, CreditCard, TrendingUp, X, Landmark, Moon, Sun, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/use-theme';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLElement>(null);
  const { theme, setTheme } = useTheme();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} className="text-blue-500" /> },
    { name: 'Transactions', path: '/transactions', icon: <ReceiptText size={20} className="text-pink-500" /> },
    { name: 'Budgets', path: '/budgets', icon: <CreditCard size={20} className="text-purple-500" /> },
    { name: 'Goals', path: '/goals', icon: <TrendingUp size={20} className="text-green-500" /> },
    { name: 'Loans', path: '/loans', icon: <Landmark size={20} className="text-amber-500" /> },
    { name: 'Reports', path: '/reports', icon: <PieChart size={20} className="text-indigo-500" /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} className="text-slate-500" /> },
  ];

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        document.dispatchEvent(new CustomEvent('closeSidebar'));
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "bg-sidebar bg-gradient-sidebar transition-all duration-300 shadow-xl z-30 border-r border-sidebar-border dark:border-sidebar-border/30",
        isMobile 
          ? "fixed inset-y-0 left-0 w-72 transform" + (isOpen ? " translate-x-0" : " -translate-x-full")
          : isOpen ? "w-72" : "w-0 md:w-20"
      )}
    >
      <div className="h-full flex flex-col relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-40 -right-20 w-40 h-40 rounded-full bg-primary/5 animate-pulse-soft"></div>
          <div className="absolute bottom-40 -left-10 w-20 h-20 rounded-full bg-blue-400/5 animate-float"></div>
        </div>

        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border/50 relative z-10">
          {isOpen ? (
            <>
              <h1 className="text-xl font-bold gradient-text">SmartSpend</h1>
              {isMobile && (
                <Button variant="ghost" size="icon" className="ml-auto icon-animate" aria-label="Close Sidebar">
                  <X size={20} />
                </Button>
              )}
            </>
          ) : (
            <span className="text-2xl font-bold gradient-text md:block hidden">S</span>
          )}
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto relative z-10">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-3 rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  !isOpen && "justify-center md:block hidden",
                  isOpen && "group"
                )
              }
            >
              <div className={cn(
                "flex items-center",
                isOpen && "transition-transform duration-300 group-hover:translate-x-1"
              )}>
                <span className={cn(
                  "flex items-center justify-center",
                  isOpen && "transition-transform duration-300 group-hover:scale-110"
                )}>
                  {item.icon}
                </span>
                {isOpen && <span className="ml-3 font-medium">{item.name}</span>}
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle button at bottom */}
        {isOpen && (
          <div className="p-4 border-t border-sidebar-border/50 flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Theme</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="icon-animate"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
