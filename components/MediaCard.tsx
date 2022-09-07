import React from 'react';
import { useRouter } from 'next/router';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { CLIENT_BASE_URL } from '../utils/URLs';

interface Props {
	media: NexusGenObjects['MovieResult'] | NexusGenObjects['ShowResult'];
}

const MediaCard = ({ media }: Props) => {
	const router = useRouter();

	const mediaTitle = 'title' in media ? media.title : media.name;

	const handleGoToDetailsPage = () => {
		let mediaType: ESearchType.MOVIE | ESearchType.SHOW;

		mediaType = 'title' in media ? ESearchType.MOVIE : ESearchType.SHOW;

		router.replace(getDetailsPageRoute(mediaType, media.id, mediaTitle));
	};

	return (
		<div>
			<h1 onClick={handleGoToDetailsPage}>{mediaTitle}</h1>
		</div>
	);
};

export default MediaCard;
