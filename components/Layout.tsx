import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

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
