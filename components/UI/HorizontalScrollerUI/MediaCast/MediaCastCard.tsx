import React from 'react';
import Image from 'next/image';
import { ICast } from '@ts/interfaces';
import { EContent } from '@ts/enums';
import { getImage } from 'utils/getImage';
import Link from 'next/link';
import { getDetailsPageRoute } from 'utils/getDetailsPageRoute';

interface Props {
	item: ICast;
	dragging: Boolean;
}

const MediaCastCard = ({ item, dragging }: Props) => {
	return (
		<Link
			href={getDetailsPageRoute(EContent.PERSON, item.id, item.name)}
			passHref
		>
			<a
				onClick={e => dragging && e.preventDefault()}
				className='text-inherit no-underline'
			>
				<section className='relative mx-4 h-[15rem] w-[10rem] select-none'>
					<div className='relative h-full w-full'>
						<Image
							className='rounded-lg'
							src={getImage(item.profile_path)}
							alt={item.name}
							layout='fill'
						/>
					</div>

					<div className='relative flex w-full flex-wrap content-start whitespace-normal'>
						<h2 className='m-0 w-full break-words text-center text-base'>
							<p className='font-bold'>{item.name}</p>
							<p className='break-words'>{item.character}</p>
						</h2>
					</div>
				</section>
			</a>
		</Link>
	);
};

export default MediaCastCard;
