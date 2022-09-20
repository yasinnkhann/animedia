import React, { useState, useEffect } from 'react';
import { IUseGQLQuery } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';
import { useGQLQuery } from '../../hooks/useGQL';
import * as Queries from '../../graphql/queries';
import MediaList from 'components/MediaList';
import Pagination from 'components/Pagination';
import { RESULTS_PER_PAGE } from '../../utils/resultsPerPage';

const PopularAnimeShows = () => {
	const [_currMediaItems, setCurrMediaItems] = useState<
		NexusGenObjects['ShowsRes']['results']
	>([]);
	const [currPage, setCurrPage] = useState(1);
	const [mediaItemsPerPage] = useState(RESULTS_PER_PAGE);

	const {
		data: popularAnimeShowsData,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['popularAnimeShows']
	> = useGQLQuery<NexusGenArgTypes['Query']['popularAnimeShows']>(
		Queries.QUERY_POPULAR_ANIME_SHOWS,
		{
			variables: {
				page: currPage,
			},
		}
	);

	useEffect(() => {
		if (popularAnimeShowsData) {
			const endIdx = currPage * mediaItemsPerPage;
			const startIdx = endIdx - mediaItemsPerPage;
			const mediaItemsCopy = [...popularAnimeShowsData.results];
			setCurrMediaItems(mediaItemsCopy.slice(startIdx, endIdx));
		}
	}, [currPage, popularAnimeShowsData, mediaItemsPerPage]);

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

	console.log(popularAnimeShowsData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			popular anime shows
			{popularAnimeShowsData && (
				<>
					<MediaList mediaData={popularAnimeShowsData} pageNum={currPage} />
					<Pagination
						itemsPerPage={mediaItemsPerPage}
						totalItems={popularAnimeShowsData.total_results}
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

export default PopularAnimeShows;
