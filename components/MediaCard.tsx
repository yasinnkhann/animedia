import React from 'react';
import { useRouter } from 'next/router';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { BASE_IMG_URL } from '../utils/URLs';
import Image from 'next/image';

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
		<section>
			<h1 onClick={handleGoToDetailsPage}>{mediaTitle}</h1>
			<div>
				<Image
					src={BASE_IMG_URL + media.poster_path}
					alt={mediaTitle}
					height='100%'
					width='100%'
					onClick={handleGoToDetailsPage}
				/>
			</div>
		</section>
	);
};

export default MediaCard;
