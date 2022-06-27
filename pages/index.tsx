import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import { animeAPI } from '../utils/anime-api';

const Home: NextPage = () => {
	const [animes, setAnimes] = useState([]);

	const fetchAnimes = async () => {
		const { data } = await axios.get(animeAPI);
		setAnimes(data);
	};

	useEffect(() => {
		fetchAnimes();
	}, []);

	return <h1 className='text-red-500'>{JSON.stringify(animes)}</h1>;
};

export default Home;
