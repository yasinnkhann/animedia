import type { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
import { useGetQuery } from '../hooks/useGetQuery';
import * as Queries from '../graphql/queries';
import { DocumentNode } from '@apollo/client';

interface Props {}

const Search: NextPage = (props: Props) => {
	const router = useRouter();

	const {
		data: searchedMovies,
		loading,
		error,
		refetch,
	} = useGetQuery(Queries.QUERY_SEARCHED_MOVIES, { q: router.query.q });

	// Preparing the lazy functions
	// const { fetchData: _ } = useGetQuery(Queries.QUERY_SEARCHED_SHOWS);

	console.log(searchedMovies);

	return (
		<div className='mt-[calc(var(--header-height-mobile)+1rem)]'>search</div>
	);
};

export default Search;
