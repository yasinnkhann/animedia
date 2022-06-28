import React from 'react';
import { IAnime } from '../models/IAnime';
import AnimeCard from './AnimeCard';

interface Props {
	animes: IAnime[];
}

const AnimeList = (props: Props) => {
	return (
		<div>
			{props.animes?.map(anime => (
				<AnimeCard key={anime.mal_id} anime={anime} />
			))}
		</div>
	);
};

export default AnimeList;
