import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Pagination from 'components/Pagination';
import MediaList from 'components/MediaPerson/MediaList';
import * as Queries from 'graphql/queries';
import { Select } from 'antd';
import { RESULTS_PER_PAGE } from 'utils/constants';
import { Circles } from 'react-loading-icons';
import { useQuery } from '@apollo/client';
import { GameGenre } from 'graphql/generated/code-gen/graphql';

const { Option } = Select;

const Genre = () => {
	const router = useRouter();
	const [currPage, setCurrPage] = useState(1);

	const { data: gameGenresData, loading: gameGenresLoading } = useQuery(
		Queries.GAME_GENRES
	);

	const [gameGenreType, setGameGenreType] = useState<GameGenre['id'] | null>(
		null
	);

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
			setGameGenreType(gameGenresData.gameGenres[0].id);
		}
	}, [gameGenresData?.gameGenres]);

	if (
		gameGenresLoading ||
		!gameGenresData?.gameGenres.length ||
		!gameGenreType
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
								defaultValue={gameGenreType}
								onChange={value => setGameGenreType(value)}
							>
								{gameGenresData.gameGenres.map(option => (
									<Option key={option.id} value={option.id}>
										{option.name}
									</Option>
								))}
							</Select>
						</div>
					</section>
					{/* {(genreOfGamesData?.[
						Object.keys(genreOfGamesData)[0] as keyof typeof genreOfGamesData
					] as unknown as TMoviesGenreData) ? (
						<div>
							<MediaList
								mediaData={
									genreOfGamesData?.[
										Object.keys(
											genreOfGamesData
										)[0] as keyof typeof genreOfGamesData
									] as unknown as TMoviesGenreData
								}
								pageNum={currPage}
								title={`Top-Rated ${movieGenreType} Movies`}
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
					)} */}
				</section>
			</main>
		</>
	);
};

export default Genre;
