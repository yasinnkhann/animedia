import React from 'react';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';

interface Props {
	media: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];
}

const MediaCard = ({ media }: Props) => {
	const mediaTitle = 'title' in media ? media.title : media.name;

	return (
		<div>
			<h1>{mediaTitle}</h1>
		</div>
	);
};

export default MediaCard;
