import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '../../RoundProgressBar';
import { CommonMethods } from '../../../utils/CommonMethods';
import {
	MovieResult,
	ShowResult,
	UserMovie,
	UserShow,
} from '../../../graphql/generated/code-gen/graphql';

interface Props {
	item: MovieResult | ShowResult;
	dragging: boolean;
	userMatchedMedias: UserShow[] | UserMovie[];
}

const HomeCard = ({ item, dragging, userMatchedMedias }: Props) => {
	const isMovie = 'title' in item;

	const titleName = isMovie ? item.title : item.name;

	const userWatchStatusFromMedia = CommonMethods.getUserStatusFromMedia(userMatchedMedias, item);

	return (
		<Link
			href={CommonMethods.getDetailsPageRoute(isMovie ? 'movie' : 'show', item.id, titleName)}
			passHref
		>
			<a onClick={e => dragging && e.preventDefault()} className='text-inherit no-underline'>
				<section className='relative mx-4 h-[15rem] w-[10rem] select-none'>
					<div className='relative h-full w-full'>
						<Image
							className='rounded-lg'
							src={CommonMethods.getTheMovieDbImage(item.poster_path)}
							alt={titleName}
							layout='fill'
							priority
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
						<div className='relative bottom-[1rem] left-4 h-[2.5rem] w-[2.5rem]'>
							<RoundProgressBar percentageVal={+(item.vote_average ?? 0).toFixed(1) * 10} />
						</div>

						<h2 className='m-0 w-full break-words text-base'>
							<p className='font-bold'>{titleName}</p>
						</h2>

						<p className='m-0 p-0 text-sm'>
							{isMovie
								? item.release_date
									? CommonMethods.formatDate(item.release_date)
									: 'Release Date Not Available'
								: item.first_air_date
									? CommonMethods.formatDate(item.first_air_date)
									: 'First Air Date Not Available'}
						</p>
					</div>
				</section>
			</a>
		</Link>
	);
};

export default HomeCard;
