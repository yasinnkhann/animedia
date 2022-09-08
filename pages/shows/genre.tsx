import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useGetQuery } from '../../hooks/useGetQuery';
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
import { IUseGetQuery } from '@ts/interfaces';
import { RESULTS_PER_PAGE } from 'utils/resultsPerPage';
import MediaList from 'components/MediaList';
import Pagination from 'components/Pagination';
import 'antd/dist/antd.css';

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

	const { data: genreOfShowsData }: IUseGetQuery<NexusGenObjects['ShowsRes']> =
		useGetQuery<NexusGenArgTypes['Query']['popularShowsByGenre']>(
			sortByQueryType,
			{
				genre: showGenreType,
				page: currPage,
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
			movie genre
			<br />
			<br />
			<div>
				<label className='block mb-1 text-blue-500' htmlFor='sort-by-dropdown'>
					Sort By:
				</label>
				<Select
					id='sort-by-dropdown'
					defaultValue='Popular'
					style={{ width: 120 }}
					onChange={handleSortByChange}
				>
					{SORT_BY_OPTIONS.map(option => (
						<Option key={option.value} value={option.value}>
							{option.text}
						</Option>
					))}
				</Select>
			</div>
			<>
				<br />
				<br />
				<label
					className='block mb-1 text-blue-500'
					htmlFor='genre-type-dropdown'
				>
					Genre Type:
				</label>
				<Select
					id='genre-type-dropdown'
					size='middle'
					defaultValue='Action_AMPERSAND_Adventure'
					onChange={handleGenreTypeChange}
					style={{ width: 200 }}
				>
					{SHOW_GENRE_TYPE_OPTIONS.map(option => (
						<Option key={option.value} value={option.value}>
							{option.text}
						</Option>
					))}
				</Select>
				<br />
			</>
			{genreOfShowsData && (
				<>
					<MediaList mediaData={genreOfShowsData} pageNum={currPage} />
					<Pagination
						itemsPerPage={mediaItemsPerPage}
						totalItems={genreOfShowsData.total_results}
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

export default Genre;
