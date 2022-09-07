import React, { useState, useEffect } from 'react';
import { IUseGetQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { useGetQuery } from '../../hooks/useGetQuery';
import * as Queries from '../../graphql/queries';
import MediaList from 'components/MediaList';
import Pagination from 'components/Pagination';

const PopularMovies = () => {
	const [_currMediaItems, setCurrMediaItems] = useState<
		NexusGenObjects['MoviesRes']['results']
	>([]);
	const [currPage, setCurrPage] = useState(1);
	const [mediaItemsPerPage] = useState(20);

	const {
		data: popularMoviesData,
	}: IUseGetQuery<NexusGenObjects['MoviesRes']> = useGetQuery<
		NexusGenArgTypes['Query']['popularMovies']
	>(Queries.QUERY_POPULAR_MOVIES, {
		page: currPage,
	});

	useEffect(() => {
		if (popularMoviesData) {
			const endIdx = currPage * mediaItemsPerPage;
			const startIdx = endIdx - mediaItemsPerPage;
			const mediaItemsCopy = [...popularMoviesData.results];
			setCurrMediaItems(mediaItemsCopy.slice(startIdx, endIdx));
		}
	}, [currPage, popularMoviesData, mediaItemsPerPage]);

	const goToNextPage = () => {
		setCurrPage(currPage => currPage + 1);
	};

	const goToPrevPage = () => {
		setCurrPage(currPage => currPage - 1);
	};

	const getPaginationGroup = () => {
		let start =
			Math.floor((currPage - 1) / mediaItemsPerPage) * mediaItemsPerPage;
		return new Array(mediaItemsPerPage)
			.fill(null)
			.map((_, idx) => start + idx + 1);
	};

	console.log(popularMoviesData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			popular movies
			{popularMoviesData && (
				<>
					<MediaList mediaData={popularMoviesData} pageNum={currPage} />
					<Pagination
						itemsPerPage={mediaItemsPerPage}
						totalItems={popularMoviesData.total_results}
						currPage={currPage}
						pageNums={getPaginationGroup()}
						paginate={pageNum => setCurrPage(pageNum)}
						goToPrevPage={goToPrevPage}
						goToNextPage={goToNextPage}
					/>
				</>
			)}
		</section>
	);
};

export default PopularMovies;
