import Image from 'next/image';
import { EContent } from '@ts/enums';
import { IRelatedMedia } from '@ts/interfaces';
import { getImage } from 'utils/getImage';
import Link from 'next/link';
import { getDetailsPageRoute } from 'utils/getDetailsPageRoute';
import { UserMovie, UserShow } from 'graphql/generated/code-gen/graphql';
import { getUserWatchStatusFromMedia } from 'utils/getUserWatchStatusFromMedia';

interface Props {
	item: IRelatedMedia;
	dragging: boolean;
	userMatchedMedias: UserShow[] | UserMovie[];
}

const RelatedCard = ({ item, dragging, userMatchedMedias }: Props) => {
	const isMovie = 'title' in item;

	const mediaTitle = isMovie ? (item.title as string) : (item.name as string);

	const userWatchStatusFromMedia = getUserWatchStatusFromMedia(
		userMatchedMedias,
		item
	);

	return (
		<Link
			href={getDetailsPageRoute(
				isMovie ? EContent.MOVIE : EContent.SHOW,
				item.id,
				mediaTitle
			)}
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
							src={getImage(item.poster_path)}
							alt={mediaTitle}
							layout='fill'
						/>
						{userWatchStatusFromMedia && (
							<div
								className={`absolute right-0 top-0 flex h-7 w-7 items-center justify-center ${
									userWatchStatusFromMedia === 'W'
										? 'bg-green-500'
										: userWatchStatusFromMedia === 'C'
										? 'bg-yellow-500'
										: userWatchStatusFromMedia === 'PW'
										? 'bg-blue-500'
										: userWatchStatusFromMedia === 'OH'
										? 'bg-orange-500'
										: userWatchStatusFromMedia === 'D'
										? 'bg-red-500'
										: ''
								} text-base text-white`}
							>
								{userWatchStatusFromMedia}
							</div>
						)}
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

export default RelatedCard;
