import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import RoundProgressBar from '../../components/RoundProgressBar';
import { Circles } from 'react-loading-icons';
import commaNumber from 'comma-number';
import RelatedHorizontalScroller from '../../components/HorizontalScroller/Related/RelatedHorizontalScroller';
import MediaCastHorizontalScroller from '../../components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';
import { useSession } from 'next-auth/react';
import { ICast } from '@ts/interfaces';
import { watchStatusOptions, ratingOptions } from 'models/dropDownOptions';
import { getEnglishName } from 'all-iso-language-codes';
import { CommonMethods } from '../../utils/CommonMethods';
import { useMutation, useQuery } from '@apollo/client';
import { WatchStatusTypes } from 'graphql/generated/code-gen/graphql';
import _ from 'lodash';

const GameDetails = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [watchStatus, setWatchStatus] = useState<WatchStatusTypes>(
		WatchStatusTypes.NotWatching
	);

	const [rating, setRating] = useState<number>(ratingOptions[0].value);

	const id = (router.query?.['id-name'] as string)?.split('-')[0];

	const { data: gameDetailsData, loading: gameDetailsLoading } = useQuery(
		Queries.GAME_DETAILS,
		{
			skip: !id,
			variables: {
				gameDetailsId: id,
			},
			fetchPolicy: 'network-only',
		}
	);

	if (gameDetailsLoading || !gameDetailsData?.gameDetails) {
		return (
			<section className='flex h-screen items-center justify-center'>
				<Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
			</section>
		);
	}

	if (gameDetailsData.gameDetails.results.length !== 1) {
		return <section>Error getting game</section>;
	}

	const game = gameDetailsData.gameDetails.results[0];
	console.log(game);

	return (
		<>
			<Head>
				<title>{game.name}</title>
			</Head>

			<main className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
				<section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
					<Image
						className='rounded-lg'
						src={CommonMethods.getIgdbImage(game.coverUrl ?? '')}
						alt={game.name}
						layout='fill'
					/>
				</section>

				<section className='mt-4'>
					<section className='mb-8 mt-8 flex items-center'>
						<section className='h-[5rem] w-[5rem]'>
							<RoundProgressBar
								percentageVal={+(game.rating ?? 0).toFixed(1)}
							/>
						</section>
						<p className='ml-[.5rem] text-base font-medium'>
							{commaNumber(game.rating_count ?? 0)} voted users
						</p>
					</section>

					<section className='pb-32'>
						<h1>{game.name}</h1>
						<p className='my-4'>{game.storyline}</p>
					</section>
				</section>
			</main>
		</>
	);
};

export default GameDetails;
