import React from 'react';
import { getDetailsPageRoute } from '../../../utils/getDetailsPageRoute';
import { ESearchType } from '@ts/enums';
import Image from 'next/image';
import { formatDate } from '../../../utils/formatDate';
import { getImage } from 'utils/getImage';
import Link from 'next/link';
import {
	MovieResult,
	ShowResult,
	PersonResult,
} from '../../../graphql/generated/code-gen/graphql';

interface Props {
	result: MovieResult | ShowResult | PersonResult;
	searchedResultType: ESearchType;
}

const SearchResult = ({ result, searchedResultType }: Props) => {
	const mediaTitle = 'title' in result ? result.title : result.name;

	const renderSearchResult = () => {
		let searchResult;
		if (searchedResultType === ESearchType.MOVIE) {
			searchResult = result as MovieResult;
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
			searchResult = result as ShowResult;
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
			searchResult = result as PersonResult;
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
		<Link
			href={getDetailsPageRoute(searchedResultType, result.id, mediaTitle)}
			passHref
		>
			<a className='text-inherit no-underline'>
				<section className='my-4 mr-16 flex h-[8rem] rounded-lg border'>
					{renderSearchResult()}
				</section>
			</a>
		</Link>
	);
};

export default SearchResult;
