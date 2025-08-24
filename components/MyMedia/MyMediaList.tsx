import { Fragment, JSX } from 'react';
import { ExtractStrict, TContent, TStatusParam } from '@ts/types';
import MyMovieEntry from './MyMovieEntry';
import MyShowEntry from './MyShowEntry';
import { UserGame, UserMovie, UserShow } from 'graphql/generated/code-gen/graphql';
import MyGameEntry from './MyGameEntry';

interface Props {
	status: TStatusParam;
	myMedias: UserMovie[] | UserShow[] | UserGame[];
	mediaType: Uppercase<ExtractStrict<TContent, 'movies' | 'shows' | 'games'>>;
}

const MyMediaList = ({ status, myMedias, mediaType }: Props) => {
	const adjustedStatus = status?.toUpperCase().split('-').join(' ') ?? '';

	return (
		<section className='w-full px-4 sm:px-10 md:px-20 lg:px-40'>
			<section className='flex flex-col pb-4'>
				<div className='relative mt-8 flex h-[3rem] items-center justify-center bg-gray-200'>
					<h4 className='text-center text-blue-500'>
						{adjustedStatus ? `${adjustedStatus} ${mediaType}` : mediaType}
					</h4>
					<h4 className='ml-2 text-green-700'>{myMedias.length}</h4>
				</div>
				<table>
					<thead>
						<tr className='border-2 border-gray-200'>
							<th className='w-[5rem] border-r-2 border-gray-200 p-4'>#</th>

							<th className='border-r-2 border-gray-200 p-4'>Title</th>

							<th className='w-[7rem] border-x-2 border-gray-200 p-4'>My Rating</th>

							{mediaType === 'SHOWS' && (
								<th className='w-[8rem] border-x-2 border-gray-200 p-4'>Current Ep.</th>
							)}

							{mediaType === 'GAMES' && (
								<th className='w-[8rem] border-x-2 border-gray-200 p-4'>In Wishlist</th>
							)}

							<th className='w-[7rem] border-x-2 border-gray-200 p-4'>Remove</th>
						</tr>
					</thead>

					<tbody className='!border-b-2 !border-gray-200'>
						{myMedias?.map((myMedia, idx) => {
							let myMediaComp: JSX.Element;
							if (mediaType === 'MOVIES') {
								myMediaComp = (
									<MyMovieEntry key={myMedia.id} myMovie={myMedia as UserMovie} count={idx + 1} />
								);
							} else if (mediaType === 'SHOWS') {
								myMediaComp = (
									<MyShowEntry key={myMedia.id} myShow={myMedia as UserShow} count={idx + 1} />
								);
							} else if (mediaType === 'GAMES') {
								myMediaComp = (
									<MyGameEntry key={myMedia.id} myGame={myMedia as UserGame} count={idx + 1} />
								);
							} else {
								myMediaComp = <></>;
							}
							return <Fragment key={myMedia.id}>{myMediaComp}</Fragment>;
						})}
					</tbody>
				</table>
			</section>
		</section>
	);
};

export default MyMediaList;
