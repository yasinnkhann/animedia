import React, { useState, useEffect } from 'react';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { getDetailsPageRoute } from '../../utils/getDetailsPageRoute';
import { useRouter } from 'next/router';
import { ESearchType } from '@ts/enums';
import { IUseGQLMutation, IUseGQLQuery } from '@ts/interfaces';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { useSession } from 'next-auth/react';
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

	const { data: usersShowsData }: IUseGQLQuery<NexusGenObjects['UserShow'][]> =
		useGQLQuery(Queries.QUERY_GET_USERS_SHOWS);

	const [shows, setShows] = useState<NexusGenObjects['UserShow'][]>([]);
	const [showId, setShowId] = useState<string>('');

	const {
		mutateFunction: deleteShow,
	}: IUseGQLMutation<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Mutation']['deletedShow']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['deletedShow']>(
		Mutations.MUTATION_DELETE_SHOW,
		{
			variables: {
				showId,
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOWS,
				},
				'UsersShows',
			],
		}
	);

	useEffect(() => {
		if (usersShowsData) {
			let statusParam = router.query.status;
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

			const showsFiltered = usersShowsData.filter(
				(show: NexusGenObjects['UserShow']) => show.status === status
			);
			setShows(showsFiltered);
		}
	}, [router.query.status, usersShowsData]);

	console.log('SHOWS: ', shows);

	return (
		<section className='mt-[calc(var(--header-height-mobile)+1rem)]'>
			<section>
				<section>
					{shows.map(show => (
						<div key={show.id}>
							<a
								onClick={() =>
									router.push(
										getDetailsPageRoute(
											ESearchType.SHOW,
											Number(show.id),
											show.name as string
										)
									)
								}
							>
								{show.name}
							</a>
							<button
								onClick={() => {
									setShowId(show.id as string);
									deleteShow({
										variables: {
											showId: show.id as string,
										},
									});
								}}
							>
								Remove
							</button>
						</div>
					))}
				</section>
			</section>
		</section>
	);
};

export default Status;
