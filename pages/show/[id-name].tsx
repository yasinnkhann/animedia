import React, { useState, useEffect, useRef } from 'react';
import { request } from 'graphql-request';
import { GetServerSideProps } from 'next';
import { SERVER_BASE_URL } from '../../utils/URLs';
import { useSession } from 'next-auth/react';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { useGQLMutation, useGQLQuery } from '../../hooks/useGQL';
import { IUseGQLQuery, IUseGQLMutation } from '@ts/interfaces';
import {
	NexusGenObjects,
	NexusGenArgTypes,
	NexusGenEnums,
} from '../../graphql/generated/nexus-typegen';
import { watchStatusOptions } from 'models/watchStatusOptions';
import { ratingOptions } from 'models/ratingOptions';

interface Props {
	showDetails: NexusGenObjects['ShowDetailsRes'];
}

const ShowDetails = ({ showDetails }: Props) => {
	const { data: session, status } = useSession();

	const [watchStatus, setWatchStatus] =
		useState<NexusGenEnums['WatchStatusTypes']>('NOT_WATCHING');
	const [rating, setRating] = useState<string | number>(ratingOptions[0].value);

	const [currEp, setCurrEp] = useState<string>('0');

	const episodeRef = useRef<HTMLInputElement>(null);

	const {
		data: usersShowData,
	}: IUseGQLQuery<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Query']['usersShow']
	> = useGQLQuery<NexusGenArgTypes['Query']['usersShow']>(
		Queries.QUERY_GET_USERS_SHOW,
		{
			variables: {
				showId: String(showDetails.id),
			},
		}
	);

	const {
		mutateFunction: addShow,
	}: IUseGQLMutation<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Mutation']['addedShow']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['addedShow']>(
		Mutations.MUTATION_ADD_SHOW,
		{
			variables: {
				showId: String(showDetails.id),
				showName: showDetails.name,
				watchStatus,
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOW,
					variables: {
						showId: String(showDetails.id),
					},
				},
				'UsersShow',
			],
		}
	);

	const {
		mutateFunction: updateShow,
	}: IUseGQLMutation<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Mutation']['updatedShow']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['updatedShow']>(
		Mutations.MUTATION_UPDATE_SHOW,
		{
			variables: {
				showId: String(showDetails.id),
				watchStatus,
				showRating: typeof rating === 'number' ? rating : null,
			},
		}
	);

	const {
		mutateFunction: deleteShow,
	}: IUseGQLMutation<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Mutation']['deletedShow']
	> = useGQLMutation<NexusGenArgTypes['Mutation']['deletedShow']>(
		Mutations.MUTATION_DELETE_SHOW,
		{
			variables: {
				showId: String(showDetails.id),
			},
			refetchQueries: () => [
				{
					query: Queries.QUERY_GET_USERS_SHOW,
					variables: {
						showId: String(showDetails.id),
					},
				},
				'UsersShow',
			],
		}
	);

	const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		console.log(value);

		setWatchStatus(value as NexusGenEnums['WatchStatusTypes']);

		if (usersShowData) {
			if ((value as NexusGenEnums['WatchStatusTypes']) === 'NOT_WATCHING') {
				deleteShow({
					variables: {
						showId: String(showDetails.id),
					},
				});
			} else {
				updateShow({
					variables: {
						showId: String(showDetails.id),
						watchStatus: value as NexusGenEnums['WatchStatusTypes'],
					},
				});
			}
		} else {
			addShow({
				variables: {
					showId: String(showDetails.id),
					showName: showDetails.name,
					watchStatus: value as NexusGenEnums['WatchStatusTypes'],
				},
			});
		}
	};

	const handleChangeRating = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		setRating(isNaN(parseInt(value)) ? '' : parseInt(value));

		console.log('rating: ', rating);
		updateShow({
			variables: {
				showId: String(showDetails.id),
				showRating: isNaN(parseInt(value)) ? null : parseInt(value),
				watchStatus,
			},
		});
	};

	const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (episodeRef.current?.value) {
			if (/[\D]/gi.test(episodeRef.current.value)) {
				episodeRef.current.value = '0';
				setCurrEp(episodeRef.current.value);
				return;
			} else {
				setCurrEp(episodeRef.current.value);
			}
		}
	};

	console.log('REF: ', episodeRef.current?.value);

	const handleEpisodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateShow({
			variables: {
				showId: String(showDetails.id),
				showRating: typeof rating === 'string' ? null : rating,
				watchStatus,
				currentEpisode: Number(episodeRef.current?.value),
			},
		});
	};

	useEffect(() => {
		if (usersShowData) {
			setWatchStatus(usersShowData.status!);
			setRating(usersShowData?.rating ?? '');
		}
	}, [usersShowData]);

	useEffect(() => {
		if (watchStatus === 'NOT_WATCHING') {
			setRating('');
		}
	}, [watchStatus]);

	console.log('USERS SHOW: ', usersShowData);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)] m-4'>
			<div className='w-[75%]'>
				<h1>{showDetails.name}</h1>
				<p>{showDetails.overview}</p>
			</div>
			<div>
				{status === 'authenticated' && session.user && (
					<div className='flex'>
						<select value={watchStatus} onChange={handleChangeWatchStatus}>
							{watchStatusOptions.map(option => (
								<option key={option.value} value={option.value}>
									{option.text}
								</option>
							))}
						</select>

						<select
							className='mx-4'
							value={rating}
							onChange={handleChangeRating}
							disabled={watchStatus === 'NOT_WATCHING'}
						>
							{ratingOptions.map(option => (
								<option key={option.value} value={option.value}>
									{option.text}
								</option>
							))}
						</select>

						<form
							className='border border-gray-500'
							onSubmit={handleEpisodeSubmit}
						>
							<span>Episodes:</span>
							<input
								type='text'
								className='text-right w-12'
								ref={episodeRef}
								value={currEp}
								onChange={handleEpisodeChange}
								// onBlur={handleEpisodeSubmit}
							/>
							<span>/</span>
							<span>{showDetails.number_of_episodes}</span>
							<button className='mx-1 text-blue-500'>+</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};
export default ShowDetails;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const id = Number((ctx.params?.['id-name'] as string).split('-')[0]);
	const data = await request(SERVER_BASE_URL, Queries.QUERY_SHOW_DETAILS, {
		showDetailsId: id,
	});

	const { showDetails } = data;

	return {
		props: {
			showDetails,
		},
	};
};
