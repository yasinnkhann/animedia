import React from 'react';
import { useRouter } from 'next/router';
import { NexusGenObjects } from '../../../graphql/generated/nexus-typegen';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import Image from 'next/image';
import { BASE_IMG_URL } from '../../../utils/URLs';
import { formatDate } from '../../../utils/formatDate';

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
					<div className='relative min-w-[5rem] w-[5rem] cursor-pointer'>
						<Image
							className='rounded-lg'
							src={BASE_IMG_URL + searchResult.poster_path}
							alt={searchResult.title}
							layout='fill'
							priority
						/>
					</div>
					<div className='p-4'>
						<h3 className='cursor-pointer'>{searchResult.title}</h3>
						<p>{formatDate(searchResult.release_date as string)}</p>
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
					<div className='relative min-w-[5rem] w-[5rem] cursor-pointer'>
						<Image
							className='rounded-lg'
							src={BASE_IMG_URL + searchResult.poster_path}
							alt={searchResult.name}
							layout='fill'
							priority
						/>
					</div>
					<div className='p-4'>
						<h3 className='cursor-pointer'>{searchResult.name}</h3>
						<p>{formatDate(searchResult.first_air_date as string)}</p>
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
					<div className='relative min-w-[5rem] w-[5rem] cursor-pointer'>
						<Image
							className='rounded-lg'
							src={BASE_IMG_URL + searchResult.profile_path}
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
			className='flex border rounded-lg my-4 mr-16 h-[8rem]'
			onClick={directToDetailsPage}
		>
			{renderSearchResult()}
		</section>
	);
};

export default SearchResult;
