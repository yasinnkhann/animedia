import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';

const Home: NextPage = () => {
	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<SearchBar />
		</div>
	);
};

export default Home;
