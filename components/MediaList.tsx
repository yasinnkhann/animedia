import React from 'react';
import MediaCard from './MediaCard';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
interface Props {
	data: NexusGenObjects['MoviesRes'] | NexusGenObjects['ShowsRes'];
}

const MediaList = ({ data }: Props) => {
	return (
		<div>
			{data.results.map(media => (
				<div key={media.id}>
					<MediaCard media={media} />
				</div>
			))}
		</div>
	);
};

export default MediaList;
