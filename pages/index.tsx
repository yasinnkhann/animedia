import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import { animeAPI } from '../utils/anime-api';
import { IFetchedAPI } from '../models/IFetchedAPI';
import AnimeList from '../components/AnimeList';
import UseFetch from '../hooks/useFetch';

const Home: NextPage = () => {
	const [fetchedAPI, loading, error] = UseFetch(animeAPI);

	if (loading as boolean) {
		return <p>Loading...</p>;
	}

	if (error as unknown | Error) {
		console.error(error);
		if (error instanceof Error) {
			return <p>{error.message}</p>;
		}
	}

	return <div>{<AnimeList animes={(fetchedAPI as IFetchedAPI)?.data} />}</div>;
};

export default Home;
