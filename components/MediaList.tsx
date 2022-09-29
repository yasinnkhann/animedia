import React, { Fragment } from 'react';
import MovieCard from './MovieCard';
import ShowCard from './ShowCard';

import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { RESULTS_PER_PAGE } from '../utils/resultsPerPage';
import { useSession } from 'next-auth/react';

interface Props {
	mediaData: NexusGenObjects['MoviesRes'] | NexusGenObjects['ShowsRes'];
	pageNum: number;
}

const MediaList = ({ mediaData, pageNum }: Props) => {
	const { data: session } = useSession();

	return (
		<table className='w-full'>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Title</th>
					<th>Rating</th>
					{session && (
						<>
							<th>Your Rating</th>
							<th>Status</th>
						</>
					)}
				</tr>
			</thead>

			<tbody>
				{mediaData.results.map((media, idx) => {
					let mediaComp: JSX.Element;

					if ('title' in media) {
						mediaComp = (
							<MovieCard
								movie={media}
								rank={pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1}
							/>
						);
					} else {
						mediaComp = (
							<ShowCard
								show={media}
								rank={pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1}
							/>
						);
					}
					return <Fragment key={media.id}>{mediaComp}</Fragment>;
				})}
			</tbody>
		</table>
	);
};

export default MediaList;
