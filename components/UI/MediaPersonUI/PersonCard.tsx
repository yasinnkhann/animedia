import React from 'react';
import Image from 'next/image';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { EContent } from '@ts/enums';
import { getImage } from 'utils/getImage';
import Link from 'next/link';
import { PersonResult } from '../../../graphql/generated/code-gen/graphql';

interface Props {
	person: PersonResult;
	rank: number;
}

const PersonCard = ({ person }: Props) => {
	return (
		<Link
			href={getDetailsPageRoute(EContent.PERSON, person.id, person.name)}
			passHref
		>
			<a className='text-inherit no-underline'>
				<section>
					<div className='relative h-[20rem] cursor-pointer'>
						<Image
							className='rounded-lg'
							src={getImage(person.profile_path)}
							alt={person.name}
							layout='fill'
						/>
					</div>

					<div className='ml-4 mt-2'>
						<h3 className='cursor-pointer'>{person.name}</h3>
					</div>
				</section>
			</a>
		</Link>
	);
};

export default PersonCard;
