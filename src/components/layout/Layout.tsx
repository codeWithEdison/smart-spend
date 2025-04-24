
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { MobileHeader } from './MobileHeader';

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
      <main className="flex-1 p-4 md:p-8 bg-background">
        {children}
      </main>
    </div>
  );
};

export default Layout;
