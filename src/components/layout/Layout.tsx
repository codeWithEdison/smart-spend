
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from './Footer';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { theme, setTheme } = useTheme();
  
  // Close sidebar by default on mobile devices
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 animate-spin-slow"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-blue-400/10 animate-pulse-soft"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-400/10 animate-float"></div>
      </div>

      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col relative z-10">
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/70 backdrop-blur-md z-20 shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="mr-2 icon-animate"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} />
            </Button>
            <h1 className="text-xl font-bold gradient-text">SmartSpend</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="icon-animate"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </Button>
          </div>
        )}
        
        <main className={cn(
          "flex-1 transition-all duration-300 relative z-10",
          isMobile ? 'px-4 py-6 pb-24' : 'container py-10',
          !sidebarOpen && !isMobile && 'ml-0'
        )}>
          <div className="glass dark:glass-dark rounded-xl p-6 shadow-xl">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
      
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Layout;
