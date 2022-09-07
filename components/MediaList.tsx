import React from 'react';
import MediaCard from './MediaCard';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { RESULTS_PER_PAGE } from '../utils/resultsPerPage';

interface Props {
	mediaData: NexusGenObjects['MoviesRes'] | NexusGenObjects['ShowsRes'];
	pageNum: number;
}

const MediaList = ({ mediaData, pageNum }: Props) => {
	return (
		<section>
			{mediaData.results.map((media, idx) => (
				<div key={media.id}>
					<MediaCard
						media={media}
						rank={pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1}
					/>
				</div>
			))}
		</section>
	);
};

export default MediaList;
