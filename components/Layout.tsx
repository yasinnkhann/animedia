import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import dynamic from 'next/dynamic';

const Toaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster), {
  ssr: false,
});

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Toaster />
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
