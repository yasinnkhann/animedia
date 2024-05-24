import Image from 'next/image';
import Link from 'next/link';
import { BsFillTrashFill } from 'react-icons/bs';
import * as Queries from '../../graphql/queries';
import * as Mutations from '../../graphql/mutations';
import { CommonMethods } from '../../utils/CommonMethods';
import { useMutation, useQuery } from '@apollo/client';
import { UserMovie } from 'graphql/generated/code-gen/graphql';

interface Props {
	myMovie: UserMovie;
	count: number;
}

const MyMovieEntry = ({ myMovie, count }: Props) => {
	const { data: movieData } = useQuery(Queries.MOVIE_DETAILS, {
		variables: {
			movieDetailsId: myMovie.id!,
		},
	});

	const [deleteMovie] = useMutation(Mutations.DELETE_MOVIE, {
		variables: {
			movieId: myMovie.id!,
		},
		refetchQueries: () => [
			{
				query: Queries.GET_USERS_MOVIES,
			},
			'UsersMovies',
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
						'movie',
						myMovie.id!,
						myMovie.name as string
					)}
					passHref
				>
					<a className='text-inherit no-underline'>
						<section className='relative row-start-1 h-[7rem] w-[5rem] cursor-pointer'>
							<Image
								className='rounded-lg'
								src={CommonMethods.getTheMovieDbImage(
									movieData?.movieDetails?.poster_path
								)}
								priority
								alt={movieData?.movieDetails?.title}
								layout='fill'
							/>
						</section>
					</a>
				</Link>

				<section className='col-start-2 pl-4'>
					<Link
						href={CommonMethods.getDetailsPageRoute(
							'movie',
							myMovie.id!,
							myMovie.name as string
						)}
						passHref
					>
						<a className='text-inherit no-underline'>
							<h3 className='cursor-pointer'>{myMovie.name}</h3>
						</a>
					</Link>
					<p>
						{movieData?.movieDetails?.release_date
							? CommonMethods.formatDate(movieData.movieDetails?.release_date)
							: 'Release Date Not Available'}
					</p>
				</section>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<p className='text-lg'>{myMovie.rating ?? 'N/A'}</p>
			</td>

			<td className='border-x-2 border-gray-200 text-center align-middle'>
				<BsFillTrashFill
					size={20}
					className='w-full cursor-pointer text-red-500'
					onClick={() => {
						deleteMovie({
							variables: {
								movieId: myMovie.id as string,
							},
						});
					}}
				/>
			</td>
		</tr>
	);
};

export default MyMovieEntry;
