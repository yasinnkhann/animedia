import { EContent } from '../enums/index';

export interface IHorizontalScrollerItemClickInfo {
	mediaType: EContent;
	id: number;
	title: string;
}

export interface IRelatedMedia {
	id: number;
	poster_path: string | undefined | null;
	title?: string;
	name?: string;
	popularity: number;
}

export interface ICast {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
}

export interface IEPDetails {
	showId: number;
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
