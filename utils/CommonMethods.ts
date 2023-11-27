import moment from 'moment';
import unidecode from 'unidecode';
import _ from 'lodash';
import imageNotFound from '../assets/image-not-found.jpeg';
import { EContent } from '@ts/enums';
import { CLIENT_BASE_URL, BASE_IMG_URL, BASE_URL } from '../utils/constants';
import {
	MovieDetailsGenre,
	ShowDetailsGenre,
	UserShow,
	UserMovie,
	WatchStatusTypes,
	MovieGenreTypes,
	ShowGenreTypes,
} from '../graphql/generated/code-gen/graphql';

export class CommonMethods {
	public static formatDate = (dateStr: string) => {
		return moment(dateStr).format('MMM Do, YYYY');
	};

	public static getDetailsPageRoute = (
		mediaType: EContent,
		id: number,
		title: string
	) => {
		const cleanTitle = unidecode(title)
			.toLowerCase()
			.replace(/[^a-z0-9\/☆ -]/gi, '')
			.replace(/\s+/g, '-')
			.replace(/-{2,}/g, '-')
			.trim();

		return `${CLIENT_BASE_URL}/${mediaType}/${id}-${cleanTitle}`;
	};

	/*
    MOVIE
    Action          28
    Adventure       12
    Animation       16
    Comedy          35
    Crime           80
    Documentary     99
    Drama           18
    Family          10751
    Fantasy         14
    History         36
    Horror          27
    Music           10402
    Mystery         9648
    Romance         10749
    Science Fiction 878
    TV Movie        10770
    Thriller        53
    War             10752
    Western         37
  */

	/*
    TV SHOW
    Action & Adventure  10759
    Animation           16
    Comedy              35
    Crime               80
    Documentary         99
    Drama               18
    Family              10751
    Kids                10762
    Mystery             9648
    News                10763
    Reality             10764
    Sci-Fi & Fantasy    10765
    Soap                10766
    Talk                10767
    War & Politics      10768
    Western             37
  */

	public static getGenreID = async (
		genreName: `${MovieGenreTypes}` | `${ShowGenreTypes}`,
		mediaType: 'movie' | 'tv'
	): Promise<number> => {
		type TGenreObj = MovieDetailsGenre | ShowDetailsGenre;

		const parsedGenreName = genreName
			.replace(/_/gi, ' ')
			.replace(/AMPERSAND/gi, '&')
			.replace(/DASH/gi, '-');

		try {
			const res = await fetch(
				`${BASE_URL}/genre/${mediaType}/list?api_key=${process.env
					.API_KEY!}&language=en-US`
			);
			const { genres }: { genres: TGenreObj[] } = await res.json();

			const genreObj = genres.find(
				genreObj => genreObj.name === parsedGenreName
			);

			if (!genreObj?.id) {
				throw new Error('No Genre ID Found.');
			}
			return genreObj.id;
		} catch (err) {
			throw err;
		}
	};

	public static getImage = (imagePath: string | null | undefined) => {
		if (imagePath) {
			return BASE_IMG_URL + imagePath;
		} else {
			return imageNotFound;
		}
	};

	public static getKeywordId = async (q: string) => {
		type TKeywordObj = MovieDetailsGenre | ShowDetailsGenre;
		q = q.split(' ').join('+');

		try {
			const res = await fetch(
				`${BASE_URL}/search/keyword?api_key=${process.env.API_KEY!}&query=${q}`
			);
			const { results }: { results: TKeywordObj[] } = await res.json();
			if (_.isEmpty(results)) {
				throw new Error('No Keyword Results Found.');
			}
			return results[0].id;
		} catch (err) {
			throw err;
		}
	};

	public static getTrendingMedia = async (
		mediaType: 'all' | 'movie' | 'tv' | 'person',
		timeWindow: 'day' | 'week',
		pageNum: number | null | undefined
	) => {
		try {
			const res = await fetch(
				`${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${process.env
					.API_KEY!}&language=en-US&page=${pageNum ?? 1}`
			);
			const data = await res.json();

			return data;
		} catch (err) {
			throw err;
		}
	};

	public static getUserWatchStatusFromMedia = (
		userMatchedMedias: (UserShow | UserMovie)[],
		item: {
			id: number;
			[key: string]: any;
		}
	) => {
		const dataFound = userMatchedMedias.find(
			(data: UserShow | UserMovie) => parseInt(data.id!) === item.id
		);

		if (dataFound?.status) {
			switch (dataFound.status) {
				case WatchStatusTypes.Watching:
					return 'W';
				case WatchStatusTypes.Completed:
					return 'C';
				case WatchStatusTypes.PlanToWatch:
					return 'PW';
				case WatchStatusTypes.OnHold:
					return 'OH';
				default:
					return 'D';
			}
		}

		return undefined;
	};

	public static isValidEmail = (email = '') => {
		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

		return emailRegex.test(email);
	};

	public static renderTableStatus = (status: WatchStatusTypes) => {
		switch (status) {
			case 'WATCHING':
				return 'Watching';
			case 'COMPLETED':
				return 'Completed';
			case 'PLAN_TO_WATCH':
				return 'Plan to Watch';
			case 'ON_HOLD':
				return 'On Hold';
			default:
				return 'Dropped';
		}
	};

	public static statusParams: Set<string> = new Set([
		'watching',
		'completed',
		'on-hold',
		'dropped',
		'plan-to-watch',
	]);

	public static unParseSpecialChars = (str: string) => {
		return str.replace(/DASH/gi, '-').replace(/_ampersand_/gi, ' & ');
	};

	public static getWatchStatusBackgroundColor = (
		watchStatus: ReturnType<typeof CommonMethods.getUserWatchStatusFromMedia>
	) => {
		switch (watchStatus) {
			case 'W':
				return 'bg-green-500';
			case 'C':
				return 'bg-yellow-500';
			case 'PW':
				return 'bg-blue-500';
			case 'OH':
				return 'bg-orange-500';
			case 'D':
				return 'bg-red-500';
			default:
				return '';
		}
	};
}
