import React, { useState, useEffect } from 'react';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { getDetailsPageRoute } from '../../utils/getDetailsPageRoute';
import { useRouter } from 'next/router';
import { ESearchType } from '@ts/enums';
import { TStatusParam } from '@ts/types';
import { IUseGQLMutation, IUseGQLQuery } from '@ts/interfaces';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { useSession } from 'next-auth/react';
import MyMoviesList from 'components/MyMoviesList';
import {
	NexusGenObjects,
	NexusGenEnums,
	NexusGenArgTypes,
} from '../../graphql/generated/nexus-typegen';

const Status = () => {
	const router = useRouter();
	const { data: session, status } = useSession();

	if (!session && status === 'unauthenticated') {
		router.push('/');
	}

	const {
		data: usersMoviesData,
	}: IUseGQLQuery<NexusGenObjects['UserMovie'][]> = useGQLQuery(
		Queries.QUERY_GET_USERS_MOVIES
	);

	const [movies, setMovies] = useState<NexusGenObjects['UserMovie'][]>([]);
	const [movieId, setMovieId] = useState<string>('');

	const {
		mutateFunction: deleteMovie,
	}: IUseGQLMutation<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Mutation']['deletedMovie']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['deletedMovie']>(
		Mutations.MUTATION_DELETE_MOVIE,
		{
			variables: {
				movieId,
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_MOVIES,
				},
				'UsersMovies',
			],
		}
	);

	useEffect(() => {
		if (usersMoviesData) {
			let statusParam = router.query.status as TStatusParam;
			let status: NexusGenEnums['WatchStatusTypes'];

			if (statusParam === 'watching') {
				status = 'WATCHING';
			} else if (statusParam === 'completed') {
				status = 'COMPLETED';
			} else if (statusParam === 'on-hold') {
				status = 'ON_HOLD';
			} else if (statusParam === 'dropped') {
				status = 'DROPPED';
			} else if (statusParam === 'plan-to-watch') {
				status = 'PLAN_TO_WATCH';
			}

			const moviesFiltered = usersMoviesData.filter(
				(movie: NexusGenObjects['UserMovie']) => movie.status === status
			);
			setMovies(moviesFiltered);
		}
	}, [router.query.status, usersMoviesData]);

	console.log('MOVIES: ', movies);

	return (
		<main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<MyMoviesList
				status={router.query.status as TStatusParam}
				movies={movies}
			/>
			{/* <section>
				<section>
					{movies.map(movie => (
						<div key={movie.id}>
							<a
								onClick={() =>
									router.push(
										getDetailsPageRoute(
											ESearchType.MOVIE,
											Number(movie.id),
											movie.name as string
										)
									)
								}
							>
								{movie.name}
							</a>
							<button
								onClick={() => {
									setMovieId(movie.id as string);
									deleteMovie({
										variables: {
											movieId: movie.id as string,
										},
									});
								}}
							>
								Remove
							</button>
						</div>
					))}
				</section>
			</section> */}
		</main>
	);
};

export default Status;
