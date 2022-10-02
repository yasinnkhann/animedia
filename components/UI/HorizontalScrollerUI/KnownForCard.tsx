import React from 'react';
import { IHorizontalScrollerItemClickInfo } from '@ts/interfaces';
import Image from 'next/image';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen/index';
import { BASE_IMG_URL } from '../../../utils/URLs';

interface Props {
	item:
		| NexusGenObjects['PersonsKnownForMovieRes']
		| NexusGenObjects['PersonsKnownForShowRes'];

	handleItemClick: (
		itemClickInfo: IHorizontalScrollerItemClickInfo
	) => false | void | undefined;
}

const KnownForCard = ({ item }: Props) => {
	return (
		<section className='w-[10rem] h-[15rem] select-none mx-4 relative'>
			KnownForCard
		</section>
	);
};

export default KnownForCard;
