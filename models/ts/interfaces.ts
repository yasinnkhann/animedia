import { TContent } from './types';

export interface IHorizontalScrollerItemClickInfo {
	mediaType: TContent;
	id: string;
	title: string;
}

export interface IRelatedMedia {
	id: string;
	imagePath: string | undefined | null;
	name: string;
	popularity: number;
	type: 'movie' | 'show' | 'game';
}

export interface ICast {
	id: string;
	name: string;
	character: string;
	profile_path: string | null;
}

export interface IEPDetails {
	showId: string;
	season: number;
	episode: number;
}

export interface ILogin {
	email: string;
	password: string;
}

export interface IRegister {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}
