
import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, Settings, CreditCard, TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLElement>(null);
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ReceiptText size={20} /> },
    { name: 'Budgets', path: '/budgets', icon: <CreditCard size={20} /> },
    { name: 'Reports', path: '/reports', icon: <PieChart size={20} /> },
    { name: 'Goals', path: '/goals', icon: <TrendingUp size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // We can't directly set the state here as it's not passed as a prop
        // This is handled by making the entire sidebar a button on mobile
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
        "bg-sidebar transition-all duration-300 shadow-md z-30",
        isMobile 
          ? "fixed inset-y-0 left-0 w-64 transform" + (isOpen ? " translate-x-0" : " -translate-x-full")
          : isOpen ? "w-64" : "w-0 md:w-16"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {isOpen ? (
            <>
              <h1 className="text-xl font-bold text-primary">SmartSpend</h1>
              {isMobile && (
                <Button variant="ghost" size="icon" className="ml-auto" aria-label="Close Sidebar">
                  <X size={20} />
                </Button>
              )}
            </>
          ) : (
            <span className="text-2xl font-bold text-primary md:block hidden">S</span>
          )}
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
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
