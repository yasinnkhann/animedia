import React from 'react';
import { useRouter } from 'next/router';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { BASE_IMG_URL } from '../utils/URLs';
import Image from 'next/image';

interface Props {
	person: NexusGenObjects['PersonResult'];
}

const PersonCard = ({ person }: Props) => {
	const router = useRouter();

	const handleGoToDetailsPage = () => {
		router.replace(
			getDetailsPageRoute(ESearchType.PERSON, person.id, person.name)
		);
	};

	return (
		<section>
			<h1 onClick={handleGoToDetailsPage}>{person.name}</h1>
			<div>
				<Image
					src={BASE_IMG_URL + person.profile_path}
					alt={person.name}
					height='100%'
					width='100%'
					onClick={handleGoToDetailsPage}
				/>
			</div>
		</section>
	);
};

export default PersonCard;
