import Navbar from './Navbar';
import Footer from './Footer';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showAbout?: boolean;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='min-h-screen flex flex-col mx-auto bg-background text-foreground'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
