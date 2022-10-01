import React from 'react';
import { useRouter } from 'next/router';
import { NexusGenObjects } from '../graphql/generated/nexus-typegen';
import { getDetailsPageRoute } from '../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { BASE_IMG_URL } from '../utils/URLs';
import Image from 'next/image';

interface Props {
	person: NexusGenObjects['PersonResult'];
	rank: number;
}

const PersonCard = ({ person, rank }: Props) => {
	const router = useRouter();

	console.log(person);

	const handleGoToDetailsPage = () => {
		router.replace(
			getDetailsPageRoute(ESearchType.PERSON, person.id, person.name)
		);
	};

	return (
		<section>
			<h1 className='cursor-pointer' onClick={handleGoToDetailsPage}>
				{person.name}
			</h1>
			<div
				className='w-[5rem] h-[7rem] relative cursor-pointer'
				onClick={handleGoToDetailsPage}
			>
				<Image
					className='rounded-lg'
					src={BASE_IMG_URL + person.profile_path}
					alt={person.name}
					layout='fill'
				/>
			</div>
			<p>Known for: {person.known_for_department}</p>
		</section>
	);
};

export default PersonCard;
