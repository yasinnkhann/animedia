import { ExtractStrict, TContent } from '@ts/types';
import Image from 'next/legacy/image';
import { CommonMethods } from '../../utils/CommonMethods';
import Link from 'next/link';
import {
	MovieResult,
	ShowResult,
	PersonResult,
	Maybe,
	UserShow,
	UserMovie,
	GameResult,
	UserGame,
} from '../../graphql/generated/code-gen/graphql';

interface Props {
	result: MovieResult | ShowResult | PersonResult | GameResult;
	searchedResultType: ExtractStrict<TContent, 'movie' | 'show' | 'person' | 'game'>;
	userMatchedMedias: UserMovie[] | UserShow[] | UserGame[];
}

const SearchResult = ({ result, searchedResultType, userMatchedMedias }: Props) => {
	const titleName = 'title' in result ? result.title : result.name;

	const userStatusFromMedia = CommonMethods.getUserStatusFromMedia(userMatchedMedias, result);

	const renderImage = (
		imagePath: Maybe<string> | undefined,
		altText: string,
		apiType: 'igdb' | 'the-movie-db'
	) => (
		<div className='relative w-[7rem] min-w-[7rem] cursor-pointer'>
			<Image
				className='rounded-lg'
				src={
					apiType === 'the-movie-db'
						? CommonMethods.getTheMovieDbImage(imagePath)
						: CommonMethods.getIgdbImage(imagePath)
				}
				alt={altText}
				layout='fill'
				priority
			/>
			{userStatusFromMedia && (
				<div
					className={`absolute right-0 top-0 flex h-7 w-7 items-center justify-center ${CommonMethods.getWatchStatusBackgroundColor(
						userStatusFromMedia
					)} text-base text-white`}
				>
					{userStatusFromMedia}
				</div>
			)}
		</div>
	);

	const renderDetails = (releaseDate: Maybe<string> | undefined, overview: string) => (
		<div className='p-4'>
			<h3 className='cursor-pointer'>{titleName}</h3>
			<p>{releaseDate ? CommonMethods.formatDate(releaseDate) : 'Date Not Available'}</p>
			<p>
				{overview.split(' ').length > 50
					? `${overview.split(' ').slice(0, 50).join(' ')}...`
					: overview}
			</p>
		</div>
	);

	const renderSearchResult = () => {
		let searchResult;
		if (searchedResultType === 'movie') {
			searchResult = result as MovieResult;
			return (
				<>
					{renderImage(searchResult.poster_path, titleName, 'the-movie-db')}
					{renderDetails(searchResult.release_date, searchResult.overview)}
				</>
			);
		} else if (searchedResultType === 'show') {
			searchResult = result as ShowResult;
			return (
				<>
					{renderImage(searchResult.poster_path, titleName, 'the-movie-db')}
					{renderDetails(searchResult.first_air_date, searchResult.overview)}
				</>
			);
		} else if (searchedResultType === 'person') {
			searchResult = result as PersonResult;
			return (
				<>
					{renderImage(searchResult.profile_path, titleName, 'the-movie-db')}
					<div className='p-4'>
						<h3 className='cursor-pointer'>{titleName}</h3>
					</div>
				</>
			);
		} else {
			searchResult = result as GameResult;
			return (
				<>
					{renderImage(searchResult.coverUrl, titleName, 'igdb')}
					{renderDetails(
						new Date(searchResult.first_release_date * 1000).toISOString(),
						searchResult.summary ?? ''
					)}
				</>
			);
		}
	};

	return (
		<Link
			href={CommonMethods.getDetailsPageRoute(searchedResultType, result.id, titleName)}
			className='text-inherit no-underline'
		>
			<section className='my-4 mr-16 flex h-[10rem] rounded-lg border'>
				{renderSearchResult()}
			</section>
		</Link>
	);
};

export default SearchResult;
