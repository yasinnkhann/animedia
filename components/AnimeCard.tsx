import React from 'react';
import { IAnime } from '../models/IAnime';

interface Props {
	anime: IAnime;
}

const AnimeCard = (props: Props) => {
	return (
		<div>
			<h2>{props.anime.title}</h2>
			<p>{props.anime.mal_id}</p>
			<p>{props.anime.duration}</p>
			<p>{props.anime.episodes}</p>
		</div>
	);
};

export default AnimeCard;

// https://api.jikan.moe/v4/anime?q=naruto
