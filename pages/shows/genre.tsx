import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useGQLQuery } from '../../hooks/useGQL';
import * as Queries from 'graphql/queries';
import {
	NexusGenEnums,
	NexusGenArgTypes,
	NexusGenObjects,
} from 'graphql/generated/nexus-typegen';
import {
	SORT_BY_OPTIONS,
	SHOW_GENRE_TYPE_OPTIONS,
} from '../../models/dropDownOptions';
import { DocumentNode } from '@apollo/client';
import { IUseGQLQuery } from '@ts/interfaces';
import { RESULTS_PER_PAGE } from 'utils/resultsPerPage';
import MediaList from 'components/MediaList';
import Pagination from 'components/Pagination';
import 'antd/dist/antd.css';
import { unParseSpecialChars } from '../../utils/unParseSpecialChars';
import { Circles } from 'react-loading-icons';

const { Option } = Select;

const Genre = () => {
	const [_currMediaItems, setCurrMediaItems] = useState<
		NexusGenObjects['ShowsRes']['results']
	>([]);
	const [currPage, setCurrPage] = useState(1);
	const [mediaItemsPerPage] = useState(RESULTS_PER_PAGE);

	const [sortByQueryType, setSortByQueryType] = useState<DocumentNode>(
		Queries.QUERY_POPULAR_SHOWS_BY_GENRE
	);

	const [showGenreType, setShowGenreType] = useState<
		NexusGenEnums['ShowGenreTypes']
	>('Action_AMPERSAND_Adventure');

	const {
		data: genreOfShowsData,
	}: IUseGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['popularShowsByGenre']
	> = useGQLQuery<NexusGenArgTypes['Query']['popularShowsByGenre']>(
		sortByQueryType,
		{
			variables: {
				genre: showGenreType,
				page: currPage,
			},
		}
	);

	const handleSortByChange = (value: 'Popular' | 'Top Rated') => {
		if (value === 'Popular') {
			setSortByQueryType(Queries.QUERY_POPULAR_SHOWS_BY_GENRE);
		} else {
			setSortByQueryType(Queries.QUERY_TOP_RATED_SHOWS_BY_GENRE);
		}
	};

	const handleGenreTypeChange = (value: NexusGenEnums['ShowGenreTypes']) => {
		setShowGenreType(value);
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToTop();
	}, [currPage]);

	useEffect(() => {
		if (genreOfShowsData) {
			const endIdx = currPage * mediaItemsPerPage;
			const startIdx = endIdx - mediaItemsPerPage;
			const mediaItemsCopy = [...genreOfShowsData.results];
			setCurrMediaItems(mediaItemsCopy.slice(startIdx, endIdx));
		}
	}, [currPage, genreOfShowsData, mediaItemsPerPage]);

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

	console.log(genreOfShowsData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<section className='grid grid-cols-[1fr_2fr_1fr]'>
				<section className='m-4 justify-self-center'>
					<div className='mb-2'>
						<label
							className='block mb-1 text-blue-500'
							htmlFor='sort-by-dropdown'
						>
							Sort By:
						</label>
						<Select
							className='!w-[10rem]'
							id='sort-by-dropdown'
							defaultValue='Popular'
							onChange={handleSortByChange}
						>
							{SORT_BY_OPTIONS.map(option => (
								<Option key={option.value} value={option.value}>
									{option.text}
								</Option>
							))}
						</Select>
					</div>

					<div>
						<label
							className='block mb-1 text-blue-500'
							htmlFor='genre-type-dropdown'
						>
							Genre Type:
						</label>
						<Select
							className='!w-[10rem]'
							id='genre-type-dropdown'
							size='middle'
							defaultValue='Action_AMPERSAND_Adventure'
							onChange={handleGenreTypeChange}
						>
							{SHOW_GENRE_TYPE_OPTIONS.map(option => (
								<Option key={option.value} value={option.value}>
									{option.text}
								</Option>
							))}
						</Select>
					</div>
				</section>

				{genreOfShowsData ? (
					<div>
						<MediaList
							mediaData={genreOfShowsData}
							pageNum={currPage}
							title={`${
								sortByQueryType === Queries.QUERY_POPULAR_SHOWS_BY_GENRE
									? 'Popular'
									: 'Top-Rated'
							} ${unParseSpecialChars(showGenreType)} Shows`}
						/>
						<Pagination
							itemsPerPage={mediaItemsPerPage}
							totalItems={genreOfShowsData.total_results}
							currPage={currPage}
							pageNums={getPaginationGroup()}
							paginate={pageNum => setCurrPage(pageNum)}
							goToPrevPage={goToPrevPage}
							goToNextPage={goToNextPage}
						/>
					</div>
				) : (
					<div className='h-[calc(100vh-var(--header-height-mobile))] flex justify-center items-center'>
						<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
					</div>
				)}
			</section>
		</section>
	);
};

export default Genre;
