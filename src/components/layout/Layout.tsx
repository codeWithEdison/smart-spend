
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from './Footer';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Close sidebar by default on mobile devices
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex min-h-screen bg-background relative">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        {isMobile && (
          <div className="flex items-center p-4 border-b sticky top-0 bg-background z-20">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="mr-2"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} />
            </Button>
            <h1 className="text-xl font-bold text-primary">SmartSpend</h1>
          </div>
        )}
        
        <main className={`flex-1 ${isMobile ? 'px-4 py-6 pb-20' : 'container py-10'}`}>
          {children}
        </main>
        
        <Footer />
      </div>
      
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Layout;
