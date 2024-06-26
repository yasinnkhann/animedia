import Image from 'next/image';
import Link from 'next/link';
import { CommonMethods } from '../../utils/CommonMethods';
import { useSession } from 'next-auth/react';
import { GameResult } from 'graphql/generated/code-gen/graphql';
import { useQuery } from '@apollo/client';
import * as Queries from '../../graphql/queries';

interface Props {
	game: GameResult;
	rank: number;
}

const GameCard = ({ game, rank }: Props) => {
	const { data: session } = useSession();

	const { data: usersGameData } = useQuery(Queries.USERS_GAME, {
		variables: {
			gameId: game.id,
		},
	});

	return (
		<tr className='border-2'>
			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{rank}</p>
			</td>
			<td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
				<Link href={CommonMethods.getDetailsPageRoute('game', game.id, game.name)} passHref>
					<a className='text-inherit no-underline'>
						<section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
							<Image
								className='rounded-lg'
								src={CommonMethods.getIgdbImage(game.coverUrl)}
								alt={game.name}
								layout='fill'
							/>
						</section>
					</a>
				</Link>
				<section className='col-start-2 pl-4'>
					<Link href={CommonMethods.getDetailsPageRoute('game', game.id, game.name)} passHref>
						<a className='text-inherit no-underline'>
							<h3 className='cursor-pointer'>{game.name}</h3>
						</a>
					</Link>

					<p>
						{game.first_release_date
							? CommonMethods.formatDate(new Date(game.first_release_date * 1000).toISOString())
							: 'Release Date Not Available'}
					</p>
				</section>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-base'>{((game.rating ?? 0) / 10).toFixed(1)}</p>
			</td>

			{session && (
				<>
					<td className='border-x-2 border-gray-200 text-center align-middle'>
						<p>{usersGameData?.usersGame?.rating ?? 'N/A'}</p>
					</td>

					<td className='border-x-2 border-gray-200 text-center align-middle'>
						<p>{usersGameData?.usersGame?.wishlist ? 'Yes' : 'No'}</p>
					</td>
				</>
			)}
		</tr>
	);
};

export default GameCard;
