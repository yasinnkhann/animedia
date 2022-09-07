import React from 'react';
import MediaCard from './MediaCard';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
interface Props {
	mediaData: NexusGenObjects['MoviesRes'] | NexusGenObjects['ShowsRes'];
}

const MediaList = ({ mediaData }: Props) => {
	return (
		<section>
			{mediaData.results.map(media => (
				<div key={media.id}>
					<MediaCard media={media} />
				</div>
			))}
		</section>
	);
};

export default MediaList;
