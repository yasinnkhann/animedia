import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import MediaList from 'components/UI/MediaPersonUI/MediaList';
import * as Queries from 'graphql/queries';
import { Select } from 'antd';
import { useGQLQuery } from '../../hooks/useGQL';
import { DocumentNode } from '@apollo/client';
import { RESULTS_PER_PAGE } from 'utils/specificVals';
import { unParseSpecialChars } from '../../utils/unParseSpecialChars';
import { Circles } from 'react-loading-icons';
import {
	SORT_BY_OPTIONS,
	SHOW_GENRE_TYPE_OPTIONS,
} from '../../models/dropDownOptions';
import {
	NexusGenEnums,
	NexusGenArgTypes,
	NexusGenObjects,
} from 'graphql/generated/nexus-typegen';

const { Option } = Select;

const Genre = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState(1);

	const [sortByQueryType, setSortByQueryType] = useState<DocumentNode>(
		Queries.QUERY_POPULAR_SHOWS_BY_GENRE
	);

	const [showGenreType, setShowGenreType] = useState<
		NexusGenEnums['ShowGenreTypes']
	>('Action_AMPERSAND_Adventure');

	const { data: genreOfShowsData } = useGQLQuery<
		NexusGenObjects['ShowsRes'],
		NexusGenArgTypes['Query']['popularShowsByGenre']
	>(sortByQueryType, {
		variables: {
			genre: showGenreType,
			page: currPage,
		},
	});

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
		if (router.query.page) {
			setCurrPage(+(router.query.page as string));
		}
	}, [router]);

	return (
		<>
			<Head>
				<title>Explore Shows by Genres</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<section className='grid grid-cols-[20%_60%_20%]'>
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
								genrePage
							/>
							<Pagination
								currPage={currPage}
								totalItems={genreOfShowsData.total_results}
								itemsPerPage={RESULTS_PER_PAGE}
								paginate={(pageNum: number) =>
									router.push(`${router.pathname}?page=${pageNum}`)
								}
								siblingCount={1}
								maxPageNum={500}
							/>
						</div>
					) : (
						<section className='h-[calc(100vh-var(--header-height-mobile))] flex justify-center items-center'>
							<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
						</section>
					)}
				</section>
			</main>
		</>
	);
};

export default Genre;
