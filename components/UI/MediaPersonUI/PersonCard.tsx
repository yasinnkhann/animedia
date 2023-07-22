import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import { getImage } from 'utils/getImage';

interface Props {
	person: NexusGenObjects['PersonResult'];
	rank: number;
}

const PersonCard = ({ person }: Props) => {
	const router = useRouter();

	const handleGoToDetailsPage = () => {
		router.push(
			getDetailsPageRoute(ESearchType.PERSON, person.id, person.name)
		);
	};

	return (
		<section>
			<div
				className='relative h-[20rem] cursor-pointer'
				onClick={handleGoToDetailsPage}
			>
				<Image
					className='rounded-lg'
					src={getImage(person.profile_path)}
					alt={person.name}
					layout='fill'
				/>
			</div>
			<div className='ml-4 mt-2'>
				<h3 className='cursor-pointer' onClick={handleGoToDetailsPage}>
					{person.name}
				</h3>
			</div>
		</section>
	);
};

export default PersonCard;
