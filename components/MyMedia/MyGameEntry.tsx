import Image from 'next/image';
import { BsFillTrashFill } from 'react-icons/bs';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { CommonMethods } from '../../utils/CommonMethods';
import { useMutation, useQuery } from '@apollo/client';
import { UserGame } from 'graphql/generated/code-gen/graphql';
import Link from 'next/link';

interface Props {
	myGame: UserGame;
	count: number;
}

const MyGameEntry = ({ myGame, count }: Props) => {
	const { data: gameData } = useQuery(Queries.GAME_DETAILS, {
		variables: {
			gameId: myGame.id!,
		},
	});

	const [deleteGame] = useMutation(Mutations.DELETE_GAME, {
		variables: {
			gameId: myGame.id!,
		},
		refetchQueries: () => [
			{
				query: Queries.USERS_GAMES,
			},
			'UsersGames',
		],
	});

	return (
		<tr className='border-2'>
			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{count}</p>
			</td>

			<td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
				<Link
					href={CommonMethods.getDetailsPageRoute(
						'game',
						myGame.id!,
						myGame.name!
					)}
					passHref
				>
					<a className='text-inherit no-underline'>
						<section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
							<Image
								className='rounded-lg'
								src={CommonMethods.getIgdbImage(
									gameData?.gameDetails?.results[0].coverUrl
								)}
								priority
								alt={gameData?.gameDetails?.results[0].name}
								layout='fill'
							/>
						</section>
					</a>
				</Link>
				<section className='col-start-2 pl-4'>
					<Link
						href={CommonMethods.getDetailsPageRoute(
							'show',
							myGame.id!,
							myGame.name!
						)}
						passHref
					>
						<a className='text-inherit no-underline'>
							<h3 className='cursor-pointer'>{myGame.name}</h3>
						</a>
					</Link>
					<p>
						{gameData?.gameDetails?.results[0].first_release_date
							? CommonMethods.formatDate(
									new Date(
										gameData.gameDetails.results[0].first_release_date * 1000
									).toISOString()
								)
							: 'Release Date Not Available'}
					</p>
				</section>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{myGame.rating ?? 'N/A'}</p>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{myGame.wishList ? 'Yes' : 'No'}</p>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<BsFillTrashFill
					size={20}
					className='w-full cursor-pointer text-red-500'
					onClick={() => {
						deleteGame({
							variables: {
								gameId: myGame.id as string,
							},
						});
					}}
				/>
			</td>
		</tr>
	);
};

export default MyGameEntry;
