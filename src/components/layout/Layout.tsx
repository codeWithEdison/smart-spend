
import React from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className={`flex-1 ${isMobile ? 'px-4 py-6' : 'container py-10'}`}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
