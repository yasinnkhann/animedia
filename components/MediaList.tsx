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
		<section className='px-44'>
			<h3>{title}</h3>
			<table className='w-full'>
				<thead>
					<tr className='border-4 border-blue-300'>
						<th className='border-r-4 border-blue-300'>Rank</th>
						<th className='border-r-4 border-blue-300'>Title</th>
						<th>Rating</th>
						{session && (
							<>
								<th className='border-x-4 border-blue-300'>Your Rating</th>
								<th>Status</th>
							</>
						)}
					</tr>
				</thead>

				<tbody className='border-b-4 border-blue-300'>
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
