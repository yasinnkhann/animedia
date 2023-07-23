import Image from 'next/image';
import { ESearchType } from '@ts/enums';
import { IRecommendedMedia } from '@ts/interfaces';
import { getImage } from 'utils/getImage';
import Link from 'next/link';
import { getDetailsPageRoute } from 'utils/getDetailsPageRoute';

interface Props {
	item: IRecommendedMedia;
	dragging: boolean;
}

const RecommendedCard = ({ item, dragging }: Props) => {
	const isMovie = 'title' in item;

	const mediaTitle = isMovie ? (item.title as string) : (item.name as string);

	return (
		<Link
			href={{
				pathname: getDetailsPageRoute(
					isMovie ? ESearchType.MOVIE : ESearchType.SHOW,
					item.id,
					mediaTitle
				),
			}}
			passHref
		>
			<a
				onClick={e => dragging && e.preventDefault()}
				className='text-inherit no-underline'
			>
				<section
					className='relative mx-4 h-[15rem] w-[10rem] select-none'
					role='button'
					tabIndex={0}
				>
					<div className='relative h-full w-full'>
						<Image
							className='rounded-lg'
							src={getImage(item.poster_path)}
							alt={mediaTitle}
							layout='fill'
						/>
					</div>

					<div className='relative flex w-full flex-wrap content-start whitespace-normal'>
						<h2 className='m-0 w-full break-words text-center text-base'>
							<p className='font-bold'>{mediaTitle}</p>
						</h2>
					</div>
				</section>
			</a>
		</Link>
	);
};

export default RecommendedCard;
