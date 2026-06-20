import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import dynamic from 'next/dynamic';

const Toaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster), {
  ssr: false,
});

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Toaster />
      <Header />
      <main className='flex-1 pb-16 lg:pb-0'>{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Layout;
