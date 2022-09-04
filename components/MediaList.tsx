import React from 'react';
import MediaCard from './MediaCard';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
interface Props {
	mediaData: NexusGenObjects['MoviesRes'] | NexusGenObjects['ShowsRes'];
}

const MediaList = ({ mediaData }: Props) => {
	return (
		<div>
			{mediaData.results.map(media => (
				<div key={media.id}>
					<MediaCard media={media} />
				</div>
			))}
		</div>
	);
};

export default MediaList;
