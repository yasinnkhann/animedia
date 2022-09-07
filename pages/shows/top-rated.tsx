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

const TopRatedShows = () => {
	const [_currMediaItems, setCurrMediaItems] = useState<
		NexusGenObjects['ShowsRes']['results']
	>([]);
	const [currPage, setCurrPage] = useState(1);
	const [mediaItemsPerPage] = useState(20);

	const { data: topRatedShowsData }: IUseGetQuery<NexusGenObjects['ShowsRes']> =
		useGetQuery<NexusGenArgTypes['Query']['topRatedShows']>(
			Queries.QUERY_TOP_RATED_SHOWS,
			{
				page: currPage,
			}
		);

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
