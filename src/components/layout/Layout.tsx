
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { MobileHeader } from './MobileHeader';
import BottomNavigation from './BottomNavigation';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar isOpen={true} />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-background pb-20 md:pb-8">
        {children}
      </main>

      {/* Bottom Navigation - visible only on mobile */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
