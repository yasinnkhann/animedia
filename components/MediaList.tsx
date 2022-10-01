import React, { Fragment } from 'react';
import MovieCard from './MovieCard';
import ShowCard from './ShowCard';

import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { RESULTS_PER_PAGE } from '../utils/resultsPerPage';
import { useSession } from 'next-auth/react';

interface Props {
	mediaData: NexusGenObjects['MoviesRes'] | NexusGenObjects['ShowsRes'];
	pageNum: number;
	title: string;
}

const MediaList = ({ mediaData, pageNum, title }: Props) => {
	const { data: session } = useSession();

	return (
		<section className='justify-self-start'>
			<h3 className='mb-2'>{title}</h3>
			<table>
				<thead>
					<tr className='border-2 border-gray-200'>
						<th className='border-r-2 border-gray-200 min-w-[5rem]'>Rank</th>
						<th className='border-r-2 border-gray-200'>Title</th>
						<th className='min-w-[5rem]'>Rating</th>
						{session && (
							<>
								<th className='border-x-2 border-gray-200 min-w-[5rem]'>
									My Rating
								</th>
								<th className='min-w-[5rem]'>Status</th>
							</>
						)}
					</tr>
				</thead>

				<tbody className='!border-b-2 !border-gray-200'>
					{mediaData.results.map((media, idx) => {
						let mediaComp: JSX.Element;

						if ('title' in media) {
							mediaComp = (
								<MovieCard
									movie={media}
									rank={
										pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1
									}
								/>
							);
						} else {
							mediaComp = (
								<ShowCard
									show={media}
									rank={
										pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1
									}
								/>
							);
						}
						return <Fragment key={media.id}>{mediaComp}</Fragment>;
					})}
				</tbody>
			</table>
		</section>
	);
};

export default MediaList;
