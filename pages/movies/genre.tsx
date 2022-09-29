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
	MOVIE_GENRE_TYPE_OPTIONS,
} from '../../models/dropDownOptions';
import { DocumentNode } from '@apollo/client';
import { IUseGQLQuery } from '@ts/interfaces';
import { RESULTS_PER_PAGE } from 'utils/resultsPerPage';
import MediaList from 'components/MediaList';
import Pagination from 'components/Pagination';
import 'antd/dist/antd.css';

const { Option } = Select;

const Genre = () => {
	const [_currMediaItems, setCurrMediaItems] = useState<
		NexusGenObjects['MoviesRes']['results']
	>([]);
	const [currPage, setCurrPage] = useState(1);
	const [mediaItemsPerPage] = useState(RESULTS_PER_PAGE);

	const [sortByQueryType, setSortByQueryType] = useState<DocumentNode>(
		Queries.QUERY_POPULAR_MOVIES_BY_GENRE
	);

	const [movieGenreType, setMovieGenreType] =
		useState<NexusGenEnums['MovieGenreTypes']>('Action');

	const {
		data: genreOfMoviesData,
	}: IUseGQLQuery<
		NexusGenObjects['MoviesRes'],
		NexusGenArgTypes['Query']['popularMoviesByGenre']
	> = useGQLQuery<NexusGenArgTypes['Query']['popularMoviesByGenre']>(
		sortByQueryType,
		{
			variables: {
				genre: movieGenreType,
				page: currPage,
			},
		}
	);

	const handleSortByChange = (value: 'Popular' | 'Top Rated') => {
		console.log(`selected ${value}`);
		if (value === 'Popular') {
			setSortByQueryType(Queries.QUERY_POPULAR_MOVIES_BY_GENRE);
		} else {
			setSortByQueryType(Queries.QUERY_TOP_RATED_MOVIES_BY_GENRE);
		}
	};

	const handleGenreTypeChange = (value: NexusGenEnums['MovieGenreTypes']) => {
		setMovieGenreType(value);
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToTop();
	}, [currPage]);

	useEffect(() => {
		if (genreOfMoviesData) {
			const endIdx = currPage * mediaItemsPerPage;
			const startIdx = endIdx - mediaItemsPerPage;
			const mediaItemsCopy = [...genreOfMoviesData.results];
			setCurrMediaItems(mediaItemsCopy.slice(startIdx, endIdx));
		}
	}, [currPage, genreOfMoviesData, mediaItemsPerPage]);

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

	console.log(genreOfMoviesData);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
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
					defaultValue='Action'
					onChange={handleGenreTypeChange}
					style={{ width: 200 }}
				>
					{MOVIE_GENRE_TYPE_OPTIONS.map(option => (
						<Option key={option.value} value={option.value}>
							{option.text}
						</Option>
					))}
				</Select>
				<br />
			</>
			{genreOfMoviesData && (
				<>
					<MediaList
						mediaData={genreOfMoviesData}
						pageNum={currPage}
						title={`${
							sortByQueryType === Queries.QUERY_POPULAR_MOVIES_BY_GENRE
								? 'Popular'
								: 'Top-Rated'
						} ${movieGenreType} Movies`}
					/>
					<Pagination
						itemsPerPage={mediaItemsPerPage}
						totalItems={genreOfMoviesData.total_results}
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
