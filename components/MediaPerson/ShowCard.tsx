import Image from 'next/image';
import Link from 'next/link';
import * as Queries from '../../graphql/queries';
import { CommonMethods } from '../../utils/CommonMethods';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import { ShowResult } from 'graphql/generated/code-gen/graphql';

interface Props {
	show: ShowResult;
	rank: number;
}

const ShowCard = ({ show, rank }: Props) => {
	const { data: session } = useSession();

	const { data: usersShowData } = useQuery(Queries.GET_USERS_SHOW, {
		variables: {
			showId: String(show.id),
		},
	});

	return (
		<tr className='border'>
			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{rank}</p>
			</td>

			<td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
				<Link
					href={CommonMethods.getDetailsPageRoute('show', show.id, show.name)}
					passHref
				>
					<a className='text-inherit no-underline'>
						<section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
							<Image
								className='rounded-lg'
								src={CommonMethods.getImage(show.poster_path)}
								alt={show.name}
								layout='fill'
							/>
						</section>
					</a>
				</Link>

				<section className='col-start-2 pl-4'>
					<Link
						href={CommonMethods.getDetailsPageRoute('show', show.id, show.name)}
						passHref
					>
						<a className='text-inherit no-underline'>
							<h3 className='cursor-pointer'>{show.name}</h3>
						</a>
					</Link>
					<p>
						{show.first_air_date
							? CommonMethods.formatDate(show.first_air_date)
							: 'First Air Date Not Available'}
					</p>
				</section>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-base'>{(show.vote_average ?? 0).toFixed(1)}</p>
			</td>

			{session && (
				<>
					<td className='border-x-2 border-gray-200 text-center align-middle'>
						<p>
							{usersShowData?.usersShow?.rating
								? usersShowData.usersShow.rating
								: 'N/A'}
						</p>
					</td>
					<td className='border-x-2 border-gray-200 px-4 text-center align-middle'>
						<p>
							{usersShowData?.usersShow?.status
								? CommonMethods.renderTableStatus(
										usersShowData.usersShow.status
									)
								: 'N/A'}
						</p>
					</td>
				</>
			)}
		</tr>
	);
};

export default ShowCard;
