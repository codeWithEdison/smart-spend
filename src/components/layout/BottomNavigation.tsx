
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, CreditCard, Settings, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // We'll use a subset of the main navigation items to avoid overcrowding
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ReceiptText size={20} /> },
    { name: 'Budgets', path: '/budgets', icon: <CreditCard size={20} /> },
    { name: 'Loans', path: '/loans', icon: <Landmark size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
      <nav className="glass dark:glass-dark border-t border-white/20 shadow-lg">
        <div className="flex justify-around items-center h-16 px-2 relative">
          {/* Animated background indicator for active item */}
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            if (isActive) {
              return (
                <motion.div
                  key={`bg-${item.path}`}
                  className="absolute inset-y-0 w-1/5 bg-primary/10 dark:bg-primary/20 rounded-xl"
                  layoutId="activeNavBackground"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                  style={{
                    left: `${index * 20}%`,
                  }}
                />
              );
            }
            return null;
          })}

          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredIndex === index;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full py-1 rounded-xl relative z-10"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div 
                  className={cn(
                    "flex flex-col items-center transition-all duration-300 transform",
                    isActive && "text-primary font-medium",
                    !isActive && "text-muted-foreground"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      y: isActive || isHovered ? -4 : 0,
                      scale: isActive ? 1.1 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.icon}
                  </motion.div>
                  
                  <motion.span 
                    className="text-xs mt-1"
                    animate={{ 
                      opacity: isActive ? 1 : 0.7,
                      y: isActive || isHovered ? 0 : 2
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomNavigation;
