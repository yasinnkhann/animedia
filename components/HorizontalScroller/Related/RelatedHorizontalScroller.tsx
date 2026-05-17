'use client';

import { useMemo } from 'react';
import RelatedCard from './RelatedCard';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from '../Arrows';
import { IRelatedMedia } from '@ts/interfaces';
import { useQuery } from '@apollo/client/react';
import * as Queries from '../../../graphql/queries';
import { UserShow, UserMovie } from 'graphql/generated/code-gen/graphql';
import { TContent } from '@ts/types';
import { ExtractStrict } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useHorizontalScroller } from 'hooks/useHorizontalScroller';

interface Props {
	items: IRelatedMedia[];
	mediaType?: ExtractStrict<TContent, 'movies' | 'shows'>;
}

const RelatedHorizontalScroller = ({ items, mediaType }: Props) => {
	const { status } = useSession();
	const shouldFetchUserMedia = status === 'authenticated';

	const { data: usersShowsData } = useQuery(Queries.USERS_SHOWS, {
		skip: !shouldFetchUserMedia || mediaType === 'movies',
		fetchPolicy: 'network-only',
	});

	const { data: usersMoviesData } = useQuery(Queries.USERS_MOVIES, {
		skip: !shouldFetchUserMedia || mediaType === 'shows',
		fetchPolicy: 'network-only',
	});

	const { dragging, handleDrag, handleMouseDown, handleMouseUp, handleWheel } =
		useHorizontalScroller();

	const userMatchedMedias = useMemo(() => {
		if (!shouldFetchUserMedia) {
			return [];
		}

		const matchedMedias: Array<UserShow | UserMovie> = [];

		if (mediaType) {
			const usersMediaMap = new Map<string, UserShow | UserMovie>();
			const userDataArr =
				mediaType === 'movies' ? usersMoviesData?.usersMovies : usersShowsData?.usersShows;

			if (userDataArr) {
				for (const userDataObj of userDataArr) {
					if (userDataObj?.id) {
						usersMediaMap.set(userDataObj.id, userDataObj);
					}
				}
				for (const item of items) {
					const matched = usersMediaMap.get(item.id);
					if (matched) {
						matchedMedias.push(matched);
					}
				}
			}
		} else {
			const usersMovies = usersMoviesData?.usersMovies ?? [];
			const usersShows = usersShowsData?.usersShows ?? [];

			const usersMoviesMap = new Map(
				usersMovies.filter((u): u is UserMovie => !!u?.id).map(u => [u.id, u])
			);
			const usersShowsMap = new Map(
				usersShows.filter((u): u is UserShow => !!u?.id).map(u => [u.id, u])
			);

			for (const item of items) {
				const map = item.type === 'movie' ? usersMoviesMap : usersShowsMap;
				const matched = map.get(item.id);
				if (matched) {
					matchedMedias.push(matched);
				}
			}
		}

		return matchedMedias;
	}, [
		usersShowsData?.usersShows,
		usersMoviesData?.usersMovies,
		items,
		mediaType,
		shouldFetchUserMedia,
	]);

	return (
		<ScrollMenu
			LeftArrow={LeftArrow}
			RightArrow={RightArrow}
			onWheel={handleWheel}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleDrag}
			scrollContainerClassName='!h-[22rem] !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
		>
			{items.map(item => (
				<RelatedCard
					key={item.id}
					itemId={item.id}
					item={item}
					dragging={dragging}
					userMatchedMedias={userMatchedMedias}
				/>
			))}
		</ScrollMenu>
	);
};

export default RelatedHorizontalScroller;
