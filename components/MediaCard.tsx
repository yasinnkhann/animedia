import React from 'react';
import { useRouter } from 'next/router';
import {
	NexusGenObjects,
	NexusGenArgTypes,
} from '../graphql/generated/nexus-typegen';
import * as Queries from '../graphql/queries';
import { IUseGQLQuery } from '@ts/interfaces';
import { useGQLQuery } from '../hooks/useGQL';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { BASE_IMG_URL } from '../utils/URLs';
import Image from 'next/image';
import { formatDate } from '../utils/formatDate';
import { useSession } from 'next-auth/react';

interface Props {
	media: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];
	rank: number;
}

const MediaCard = ({ media, rank }: Props) => {
	const { data: session } = useSession();

	const router = useRouter();

	const isMovie = 'title' in media;

	const mediaTitle = isMovie ? media.title : media.name;

	const {
		data: usersMovieData,
	}: IUseGQLQuery<
		NexusGenObjects['UserMovie'],
		NexusGenArgTypes['Query']['usersMovie']
	> = useGQLQuery<NexusGenArgTypes['Query']['usersMovie']>(
		Queries.QUERY_GET_USERS_MOVIE,
		{
			variables: {
				movieId: String(media.id),
			},
		}
	);

	const {
		data: usersShowData,
	}: IUseGQLQuery<
		NexusGenObjects['UserShow'],
		NexusGenArgTypes['Query']['usersShow']
	> = useGQLQuery<NexusGenArgTypes['Query']['usersShow']>(
		Queries.QUERY_GET_USERS_SHOW,
		{
			variables: {
				showId: String(media.id),
			},
		}
	);

	const handleGoToDetailsPage = () => {
		let mediaType: ESearchType.MOVIE | ESearchType.SHOW;

		mediaType = 'title' in media ? ESearchType.MOVIE : ESearchType.SHOW;

		router.replace(getDetailsPageRoute(mediaType, media.id, mediaTitle));
	};

	return (
		<tr className='border'>
			<td className='align-middle text-center border-x-4 border-blue-300'>
				<p className='text-lg'>{rank}</p>
			</td>

			<td
				className='break-words border-x-4 border-blue-300'
				onClick={handleGoToDetailsPage}
			>
				<h3>{mediaTitle}</h3>
				<div className='w-[5rem] h-[5rem]'>
					<Image
						src={BASE_IMG_URL + media.poster_path}
						alt={mediaTitle}
						height='100%'
						width='100%'
						onClick={handleGoToDetailsPage}
					/>
				</div>
				<p>
					{formatDate(
						isMovie
							? (media.release_date as string)
							: (media.first_air_date as string)
					)}
				</p>
			</td>
			<td className='align-middle text-center border-x-4 border-blue-300'>
				<p className='text-base'>{media.vote_average.toFixed(1)}</p>
			</td>
			{session && (
				<>
					<td className='align-middle text-center border-x-4 border-blue-300'>
						<p>
							{isMovie
								? usersMovieData?.rating
									? usersMovieData.rating
									: 'N/A'
								: usersShowData?.rating
								? usersShowData.rating
								: 'N/A'}
						</p>
					</td>
					<td className='align-middle text-center border-x-4 border-blue-300'>
						<p>
							{isMovie
								? usersMovieData?.status
									? usersMovieData.status
									: 'N/A'
								: usersShowData?.status
								? usersShowData.status
								: 'N/A'}
						</p>
					</td>
				</>
			)}
		</tr>
	);
};

export default MediaCard;
