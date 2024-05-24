import Image from 'next/image';
import Link from 'next/link';
import { IRelatedMedia } from '@ts/interfaces';
import { CommonMethods } from 'utils/CommonMethods';
import { UserMovie, UserShow } from 'graphql/generated/code-gen/graphql';

interface Props {
	item: IRelatedMedia;
	dragging: boolean;
	userMatchedMedias: UserShow[] | UserMovie[];
}

const RelatedCard = ({ item, dragging, userMatchedMedias }: Props) => {
	const isMovie = 'title' in item;

	const titleName = isMovie ? (item.title as string) : (item.name as string);

	const userWatchStatusFromMedia = CommonMethods.getUserWatchStatusFromMedia(
		userMatchedMedias,
		item
	);

	return (
		<Link
			href={CommonMethods.getDetailsPageRoute(
				isMovie ? 'movie' : 'show',
				item.id,
				titleName
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
							src={CommonMethods.getTheMovieDbImage(item.poster_path)}
							alt={titleName}
							layout='fill'
						/>
						{userWatchStatusFromMedia && (
							<div
								className={`absolute right-0 top-0 flex h-7 w-7 items-center justify-center ${CommonMethods.getWatchStatusBackgroundColor(
									userWatchStatusFromMedia
								)} text-base text-white`}
							>
								{userWatchStatusFromMedia}
							</div>
						)}
					</div>

					<div className='relative flex w-full flex-wrap content-start whitespace-normal'>
						<h2 className='m-0 w-full break-words text-center text-base'>
							<p className='font-bold'>{titleName}</p>
						</h2>
					</div>
				</section>
			</a>
		</Link>
	);
};

export default RelatedCard;
