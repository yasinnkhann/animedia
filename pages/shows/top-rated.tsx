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

const TopRatedShows = () => {
	const [_currMediaItems, setCurrMediaItems] = useState<
		NexusGenObjects['ShowsRes']['results']
	>([]);
	const [currPage, setCurrPage] = useState(1);
	const [mediaItemsPerPage] = useState(RESULTS_PER_PAGE);

	const {
		data: topRatedShowsData,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['topRatedShows']
	> = useGQLQuery<NexusGenArgTypes['Query']['topRatedShows']>(
		Queries.QUERY_TOP_RATED_SHOWS,
		{
			variables: {
				page: currPage,
			},
		}
	);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		if (topRatedShowsData) {
			const endIdx = currPage * mediaItemsPerPage;
			const startIdx = endIdx - mediaItemsPerPage;
			const mediaItemsCopy = [...topRatedShowsData.results];
			setCurrMediaItems(mediaItemsCopy.slice(startIdx, endIdx));
		}
	}, [currPage, topRatedShowsData, mediaItemsPerPage]);

	const goToNextPage = () => {
		setCurrPage(currPage => currPage + 1);
		scrollToTop();
	};

	const goToPrevPage = () => {
		setCurrPage(currPage => currPage - 1);
		scrollToTop();
	};

	const getPaginationGroup = () => {
		let start =
			Math.floor((currPage - 1) / mediaItemsPerPage) * mediaItemsPerPage;
		return new Array(mediaItemsPerPage)
			.fill(null)
			.map((_, idx) => start + idx + 1);
	};

	console.log(topRatedShowsData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			top rated shows
			{topRatedShowsData && (
				<>
					<MediaList mediaData={topRatedShowsData} pageNum={currPage} />
					<Pagination
						itemsPerPage={mediaItemsPerPage}
						totalItems={topRatedShowsData.total_results}
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

export default TopRatedShows;
