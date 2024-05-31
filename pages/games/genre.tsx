import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import MediaList from 'components/MediaPerson/MediaList';
import * as Queries from 'graphql/queries';
import { Select } from 'antd';
import { RESULTS_PER_PAGE } from 'utils/constants';
import { Circles } from 'react-loading-icons';
import { TypedDocumentNode, useQuery } from '@apollo/client';
import {
	Exact,
	GameGenre,
	PopularGamesByGenreQuery,
	TopRatedGamesByGenreQuery,
} from 'graphql/generated/code-gen/graphql';
import { SORT_BY_OPTIONS } from 'models/dropDownOptions';
import { TGamesGenreData } from '@ts/types';

const { Option } = Select;

const Genre = () => {
	const router = useRouter();

	const [currPage, setCurrPage] = useState(1);

	const { data: gameGenresData, loading: gameGenresLoading } = useQuery(
		Queries.GAME_GENRES
	);

	const [sortByQueryType, setSortByQueryType] = useState<
		TypedDocumentNode<
			PopularGamesByGenreQuery | TopRatedGamesByGenreQuery,
			Exact<{
				genreId: string;
				limit: number;
				page: number;
			}>
		>
	>(Queries.POPULAR_GAMES_BY_GENRE);

	const [selectedGameGenre, setSelectedGameGenre] = useState<GameGenre | null>(
		null
	);

	const { data: genreOfGamesData } = useQuery(sortByQueryType, {
		skip: !gameGenresData?.gameGenres.length,
		variables: {
			genreId: selectedGameGenre?.id ?? '0',
			page: currPage,
			limit: RESULTS_PER_PAGE,
		},
	});

	const handleSortByChange = (value: 'Popular' | 'Top Rated') => {
		if (value === 'Popular') {
			setSortByQueryType(Queries.POPULAR_GAMES_BY_GENRE);
		} else {
			setSortByQueryType(Queries.TOP_RATED_GAMES_BY_GENRE);
		}
	};

	const handleGenreTypeChange = (genreId: string) => {
		if (gameGenresData?.gameGenres) {
			const foundGameGenre = gameGenresData.gameGenres.find(
				genre => genre.id === genreId
			);
			if (foundGameGenre) {
				setSelectedGameGenre(foundGameGenre);
			}
		}
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

	useEffect(() => {
		if (gameGenresData?.gameGenres.length) {
			setSelectedGameGenre(gameGenresData.gameGenres[0]);
		}
	}, [gameGenresData?.gameGenres]);

	if (
		gameGenresLoading ||
		!gameGenresData?.gameGenres.length ||
		!selectedGameGenre
	) {
		return (
			<section className='flex h-screen items-center justify-center'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	return (
		<>
			<Head>
				<title>Explore Games by Genres</title>
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
								defaultValue={selectedGameGenre.name}
								onChange={handleGenreTypeChange}
							>
								{gameGenresData.gameGenres.map(option => (
									<Option key={option.id} value={option.id}>
										{option.name}
									</Option>
								))}
							</Select>
						</div>
					</section>

					{(genreOfGamesData?.[
						Object.keys(genreOfGamesData)[0] as keyof typeof genreOfGamesData
					] as unknown as TGamesGenreData) ? (
						<div>
							<MediaList
								mediaData={
									genreOfGamesData?.[
										Object.keys(
											genreOfGamesData
										)[0] as keyof typeof genreOfGamesData
									] as unknown as TGamesGenreData
								}
								pageNum={currPage}
								title={`${
									sortByQueryType === Queries.POPULAR_GAMES_BY_GENRE
										? 'Popular'
										: 'Top-Rated'
								} ${selectedGameGenre.name} Games`}
								genrePage
							/>

							<Pagination
								currPage={currPage}
								totalItems={
									(
										genreOfGamesData?.[
											Object.keys(
												genreOfGamesData
											)[0] as keyof typeof genreOfGamesData
										] as unknown as TGamesGenreData
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
