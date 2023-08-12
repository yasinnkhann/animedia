import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { EContent } from '@ts/enums';
import Image from 'next/image';
import { formatDate } from '../../../utils/formatDate';
import { getImage } from 'utils/getImage';
import Link from 'next/link';
import {
	MovieResult,
	ShowResult,
	PersonResult,
	Maybe,
} from '../../../graphql/generated/code-gen/graphql';

interface Props {
	result: MovieResult | ShowResult | PersonResult;
	searchedResultType: EContent;
}

const SearchResult = ({ result, searchedResultType }: Props) => {
	const mediaTitle = 'title' in result ? result.title : result.name;

	const renderImage = (
		imagePath: Maybe<string> | undefined,
		altText: string
	) => (
		<div className='relative w-[7rem] min-w-[7rem] cursor-pointer'>
			<Image
				className='rounded-lg'
				src={getImage(imagePath)}
				alt={altText}
				layout='fill'
				priority
			/>
		</div>
	);

	const renderMediaDetails = (
		releaseDate: Maybe<string> | undefined,
		overview: string
	) => (
		<div className='p-4'>
			<h3 className='cursor-pointer'>{mediaTitle}</h3>
			<p>{releaseDate ? formatDate(releaseDate) : 'Date Not Available'}</p>
			<p>
				{overview.split(' ').length > 50
					? `${overview.split(' ').slice(0, 50).join(' ')}...`
					: overview}
			</p>
		</div>
	);

	const renderPersonDetails = () => (
		<div className='p-4'>
			<h3 className='cursor-pointer'>{mediaTitle}</h3>
		</div>
	);

	const renderSearchResult = () => {
		if (searchedResultType === EContent.MOVIE) {
			const searchResult = result as MovieResult;
			return (
				<>
					{renderImage(searchResult.poster_path, searchResult.title)}
					{renderMediaDetails(searchResult.release_date, searchResult.overview)}
				</>
			);
		} else if (searchedResultType === EContent.SHOW) {
			const searchResult = result as ShowResult;
			return (
				<>
					{renderImage(searchResult.poster_path, searchResult.name)}
					{renderMediaDetails(
						searchResult.first_air_date,
						searchResult.overview
					)}
				</>
			);
		} else {
			const searchResult = result as PersonResult;
			return (
				<>
					{renderImage(searchResult.profile_path, searchResult.name)}
					{renderPersonDetails()}
				</>
			);
		}
	};

	return (
		<Link
			href={getDetailsPageRoute(searchedResultType, result.id, mediaTitle)}
			passHref
		>
			<a className='text-inherit no-underline'>
				<section className='my-4 mr-16 flex h-[10rem] rounded-lg border'>
					{renderSearchResult()}
				</section>
			</a>
		</Link>
	);
};

export default SearchResult;
