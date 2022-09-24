import React, { useState, useEffect } from 'react';
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
				currentEpisode: Number(currEp),
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
				currentEpisode: Number(currEp),
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
						currentEpisode: Number(currEp),
					},
				});
			}
		} else {
			addShow({
				variables: {
					showId: String(showDetails.id),
					showName: showDetails.name,
					watchStatus: value as NexusGenEnums['WatchStatusTypes'],
					currentEpisode: Number(currEp),
				},
			});
		}
	};

	const handleChangeRating = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		setRating(isNaN(parseInt(value)) ? '' : parseInt(value));

		updateShow({
			variables: {
				showId: String(showDetails.id),
				showRating: isNaN(parseInt(value)) ? null : parseInt(value),
				watchStatus,
			},
		});
	};

	const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (/[\D]/gi.test(e.target.value)) {
			setCurrEp('0');
			e.target.selectionStart = 1;
		} else {
			setCurrEp(e.target.value);
		}
	};

	const handleEpisodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (currEp === '' || +currEp > showDetails.number_of_episodes) return;

		if (+currEp === showDetails.number_of_episodes) {
			setWatchStatus('COMPLETED');
		}

		updateShow({
			variables: {
				showId: String(showDetails.id),
				showRating: typeof rating === 'string' ? null : rating,
				watchStatus,
				currentEpisode: Number(currEp),
			},
		});
	};

	const handleEpisodeOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (
			e.target.value === '' ||
			+e.target.value > showDetails.number_of_episodes
		) {
			if (typeof usersShowData?.current_episode === 'number') {
				setCurrEp(String(usersShowData.current_episode));
				return;
			} else {
				setCurrEp('0');
				return;
			}
		} else {
			updateShow({
				variables: {
					showId: String(showDetails.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus,
					currentEpisode: Number(currEp),
				},
			});
		}
	};

	const handleIncrementBtn = () => {
		let numifiedStr = Number(currEp);

		numifiedStr += 1;
		setCurrEp(String(numifiedStr));

		if (numifiedStr === 1) {
			if (!usersShowData) {
				setWatchStatus('WATCHING');
				addShow({
					variables: {
						showId: String(showDetails.id),
						showName: showDetails.name,
						watchStatus: 'WATCHING',
						currentEpisode: numifiedStr,
					},
				});
			} else {
				updateShow({
					variables: {
						showId: String(showDetails.id),
						showRating: typeof rating === 'string' ? null : rating,
						watchStatus: usersShowData.status!,
						currentEpisode: numifiedStr,
					},
				});
			}
			return;
		}

		if (numifiedStr < showDetails.number_of_episodes && usersShowData) {
			updateShow({
				variables: {
					showId: String(showDetails.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: usersShowData.status!,
					currentEpisode: numifiedStr,
				},
			});
			return;
		}

		if (numifiedStr === showDetails.number_of_episodes && usersShowData) {
			updateShow({
				variables: {
					showId: String(showDetails.id),
					showRating: typeof rating === 'string' ? null : rating,
					watchStatus: 'COMPLETED',
					currentEpisode: numifiedStr,
				},
			});
			return;
		}
	};

	useEffect(() => {
		if (usersShowData) {
			setWatchStatus(usersShowData.status!);
			setRating(usersShowData?.rating ?? '');
			setCurrEp(String(usersShowData.current_episode));
		}
	}, [usersShowData]);

	useEffect(() => {
		if (watchStatus === 'NOT_WATCHING') {
			setRating('');
			setCurrEp('0');
		}
		if (watchStatus === 'PLAN_TO_WATCH') {
			setCurrEp('0');
		}
		if (watchStatus === 'COMPLETED') {
			setCurrEp(String(showDetails.number_of_episodes));
		}
	}, [watchStatus, showDetails.number_of_episodes]);

	useEffect(() => {
		if (+currEp < showDetails.number_of_episodes && +currEp > 0) {
			setWatchStatus('WATCHING');
		}
		if (+currEp === showDetails.number_of_episodes) {
			setWatchStatus('COMPLETED');
		}
	}, [rating, currEp, showDetails.number_of_episodes]);

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
							disabled={
								watchStatus === 'NOT_WATCHING' ||
								watchStatus === 'PLAN_TO_WATCH'
							}
						>
							{ratingOptions.map(option => (
								<option key={option.value} value={option.value}>
									{option.text}
								</option>
							))}
						</select>

						<form
							className='border border-gray-500 bg-white'
							onSubmit={handleEpisodeSubmit}
						>
							<span>Episodes:</span>
							<input
								className='text-right w-12 focus:outline-none'
								type='text'
								value={currEp}
								onChange={handleEpisodeChange}
								onFocus={e => (e.target.selectionStart = 1)}
								disabled={
									watchStatus === 'NOT_WATCHING' ||
									watchStatus === 'PLAN_TO_WATCH'
								}
								onBlur={handleEpisodeOnBlur}
							/>
							<span>/</span>
							<span>{showDetails.number_of_episodes}</span>
							<button
								className='mx-1 text-blue-500'
								onClick={handleIncrementBtn}
								type='button'
								disabled={+currEp >= showDetails.number_of_episodes}
							>
								+
							</button>
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
