import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import MediaList from 'components/UI/MediaPersonUI/MediaList';
import * as Queries from 'graphql/queries';
import { Select } from 'antd';
import { TypedDocumentNode, useQuery } from '@apollo/client';
import { RESULTS_PER_PAGE } from 'utils/constants';
import { Circles } from 'react-loading-icons';
import {
	SORT_BY_OPTIONS,
	MOVIE_GENRE_TYPE_OPTIONS,
} from '../../models/dropDownOptions';
import {
	Exact,
	InputMaybe,
	MovieGenreTypes,
	PopularMoviesByGenreQuery,
	TopRatedMoviesByGenreQuery,
} from 'graphql/generated/code-gen/graphql';
import { TMoviesGenreData } from '@ts/types';

const { Option } = Select;

const Genre = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState(1);

	const [sortByQueryType, setSortByQueryType] = useState<
		TypedDocumentNode<
			PopularMoviesByGenreQuery | TopRatedMoviesByGenreQuery,
			Exact<{
				page?: InputMaybe<number> | undefined;
				genre: MovieGenreTypes;
			}>
		>
	>(Queries.POPULAR_MOVIES_BY_GENRE);

	const [movieGenreType, setMovieGenreType] = useState<MovieGenreTypes>(
		MovieGenreTypes.Action
	);

	const { data: genreOfMoviesData } = useQuery(sortByQueryType, {
		variables: { genre: movieGenreType, page: currPage },
	});

	const handleSortByChange = (value: 'Popular' | 'Top Rated') => {
		if (value === 'Popular') {
			setSortByQueryType(Queries.POPULAR_MOVIES_BY_GENRE);
		} else {
			setSortByQueryType(Queries.TOP_RATED_MOVIES_BY_GENRE);
		}
	};

	const handleGenreTypeChange = (value: MovieGenreTypes) => {
		setMovieGenreType(value);
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
				<title>Explore Movies by Genres</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
				<section className='grid grid-cols-[20%_60%_20%]'>
					<section className='mt-4 justify-self-center'>
						<div className='mb-2'>
							<label
								className='mb-1 block text-blue-500'
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
								className='mb-1 block text-blue-500'
								htmlFor='genre-type-dropdown'
							>
								Genre Type:
							</label>
							<Select
								className='!w-[10rem]'
								id='genre-type-dropdown'
								size='middle'
								defaultValue={MovieGenreTypes.Action}
								onChange={handleGenreTypeChange}
							>
								{MOVIE_GENRE_TYPE_OPTIONS.map(option => (
									<Option key={option.value} value={option.value}>
										{option.text}
									</Option>
								))}
							</Select>
						</div>
					</section>
					{(genreOfMoviesData?.[
						Object.keys(genreOfMoviesData)[0] as keyof typeof genreOfMoviesData
					] as unknown as TMoviesGenreData) ? (
						<div>
							<MediaList
								mediaData={
									genreOfMoviesData?.[
										Object.keys(
											genreOfMoviesData
										)[0] as keyof typeof genreOfMoviesData
									] as unknown as TMoviesGenreData
								}
								pageNum={currPage}
								title={`${
									sortByQueryType === Queries.POPULAR_MOVIES_BY_GENRE
										? 'Popular'
										: 'Top-Rated'
								} ${movieGenreType} Movies`}
								genrePage
							/>

							<Pagination
								currPage={currPage}
								totalItems={
									(
										genreOfMoviesData?.[
											Object.keys(
												genreOfMoviesData
											)[0] as keyof typeof genreOfMoviesData
										] as unknown as TMoviesGenreData
									).total_results
								}
								itemsPerPage={RESULTS_PER_PAGE}
								paginate={(pageNum: number) =>
									router.push(`${router.pathname}?page=${pageNum}`)
								}
								siblingCount={1}
								maxPageNum={500}
							/>
						</div>
					) : (
						<div className='flex h-[calc(100vh-var(--header-height-mobile))] items-center justify-center'>
							<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
						</div>
					)}
				</section>
			</main>
		</>
	);
};

export default Genre;
