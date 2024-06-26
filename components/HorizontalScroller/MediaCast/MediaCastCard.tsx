import Image from 'next/image';
import Link from 'next/link';
import { ICast } from '@ts/interfaces';
import { CommonMethods } from 'utils/CommonMethods';

interface Props {
	item: ICast;
	dragging: boolean;
}

const MediaCastCard = ({ item, dragging }: Props) => {
	const body = (
		<section className='relative mx-4 h-[15rem] w-[10rem] select-none'>
			<div className='relative h-full w-full'>
				<Image
					className='rounded-lg'
					src={
						item.type === 'GameCharacter'
							? CommonMethods.getIgdbImage(item.profile_path)
							: CommonMethods.getTheMovieDbImage(item.profile_path)
					}
					alt={item.name}
					layout='fill'
				/>
			</div>

			<div className='relative flex w-full flex-wrap content-start whitespace-normal'>
				<h2 className='m-0 w-full break-words text-center text-base'>
					<p className='font-bold'>{item.name}</p>
					{item.character && <p className='break-words'>{item.character}</p>}
				</h2>
			</div>
		</section>
	);
	return (
		<>
			{item.type !== 'GameCharacter' ? (
				<Link href={CommonMethods.getDetailsPageRoute('person', item.id, item.name)} passHref>
					<a onClick={e => dragging && e.preventDefault()} className='text-inherit no-underline'>
						{body}
					</a>
				</Link>
			) : (
				body
			)}
		</>
	);
};

export default MediaCastCard;
