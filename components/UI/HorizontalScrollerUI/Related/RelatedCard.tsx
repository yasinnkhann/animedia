import Image from 'next/image';
import { ESearchType } from '@ts/enums';
import { IRelatedMedia } from '@ts/interfaces';
import { getImage } from 'utils/getImage';
import Link from 'next/link';
import { getDetailsPageRoute } from 'utils/getDetailsPageRoute';
import { UserMovie, UserShow } from 'graphql/generated/code-gen/graphql';
import _ from 'lodash';

interface Props {
	item: IRelatedMedia;
	dragging: boolean;
	userMatchedMedia: UserShow[] | UserMovie[];
}

const RelatedCard = ({ item, dragging, userMatchedMedia }: Props) => {
	const isMovie = 'title' in item;

	const mediaTitle = isMovie ? (item.title as string) : (item.name as string);

	const getUserWatchStatus = () => {
		if (!_.isEmpty(userMatchedMedia)) {
			//@ts-ignore
			const dataFound = userMatchedMedia.find(
				//@ts-ignore
				data => parseInt(data.id!) === item.id
			);
			if (dataFound?.status) {
				switch (dataFound.status) {
					case 'WATCHING':
						return 'W';
					case 'COMPLETED':
						return 'C';
					case 'PLAN_TO_WATCH':
						return 'PW';
					case 'ON_HOLD':
						return 'OH';
					default:
						return 'D';
				}
			}
		}
	};

	return (
		<Link
			href={getDetailsPageRoute(
				isMovie ? ESearchType.MOVIE : ESearchType.SHOW,
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
						{getUserWatchStatus() && (
							<div
								className={`absolute top-0 right-0 flex h-7 w-7 items-center justify-center ${
									getUserWatchStatus() === 'W'
										? 'bg-green-500'
										: getUserWatchStatus() === 'C'
										? 'bg-yellow-500'
										: getUserWatchStatus() === 'PW'
										? 'bg-blue-500'
										: getUserWatchStatus() === 'OH'
										? 'bg-orange-500'
										: getUserWatchStatus() === 'D'
										? 'bg-red-500'
										: ''
								} text-base text-white`}
							>
								{getUserWatchStatus()}
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
