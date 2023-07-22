import React from 'react';
import { useRouter } from 'next/router';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import Image from 'next/image';
import { formatDate } from '../../../utils/formatDate';
import { getImage } from 'utils/getImage';

interface Props {
	result:
		| NexusGenObjects['MovieResult']
		| NexusGenObjects['ShowResult']
		| NexusGenObjects['PersonResult'];
	searchedResultType: ESearchType;
}

const SearchResult = ({ result, searchedResultType }: Props) => {
	const router = useRouter();
	const mediaTitle = 'title' in result ? result.title : result.name;

	const directToDetailsPage = () => {
		router.push(getDetailsPageRoute(searchedResultType, result.id, mediaTitle));
	};

	const renderSearchResult = () => {
		let searchResult;
		if (searchedResultType === ESearchType.MOVIE) {
			searchResult = result as NexusGenObjects['MovieResult'];
			return (
				<>
					<div className='relative w-[5rem] min-w-[5rem] cursor-pointer'>
						<Image
							className='rounded-lg'
							src={getImage(searchResult.poster_path)}
							alt={searchResult.title}
							layout='fill'
							priority
						/>
					</div>
					<div className='p-4'>
						<h3 className='cursor-pointer'>{searchResult.title}</h3>
						<p>
							{searchResult.release_date
								? formatDate(searchResult.release_date)
								: 'Release Date Not Available'}
						</p>
						<p>
							{searchResult.overview.split(' ').length > 50
								? `${searchResult.overview
										.split(' ')
										.slice(0, 50)
										.join(' ')}...`
								: searchResult.overview}
						</p>
					</div>
				</>
			);
		} else if (searchedResultType === ESearchType.SHOW) {
			searchResult = result as NexusGenObjects['ShowResult'];
			return (
				<>
					<div className='relative w-[5rem] min-w-[5rem] cursor-pointer'>
						<Image
							className='rounded-lg'
							src={getImage(searchResult.poster_path)}
							alt={searchResult.name}
							layout='fill'
							priority
						/>
					</div>
					<div className='p-4'>
						<h3 className='cursor-pointer'>{searchResult.name}</h3>
						<p>
							{searchResult.first_air_date
								? formatDate(searchResult.first_air_date)
								: 'First Air Date Not Available'}
						</p>
						<p>
							{searchResult.overview.split(' ').length > 50
								? `${searchResult.overview
										.split(' ')
										.slice(0, 50)
										.join(' ')}...`
								: searchResult.overview}
						</p>
					</div>
				</>
			);
		} else {
			searchResult = result as NexusGenObjects['PersonResult'];
			return (
				<>
					<div className='relative w-[5rem] min-w-[5rem] cursor-pointer'>
						<Image
							className='rounded-lg'
							src={getImage(searchResult.profile_path)}
							alt={searchResult.name}
							layout='fill'
							priority
						/>
					</div>
					<div className='p-4'>
						<h3 className='cursor-pointer'>{searchResult.name}</h3>
					</div>
				</>
			);
		}
	};

	return (
		<section
			className='my-4 mr-16 flex h-[8rem] rounded-lg border'
			onClick={directToDetailsPage}
		>
			{renderSearchResult()}
		</section>
	);
};

export default SearchResult;
