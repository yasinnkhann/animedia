import { EContent } from '../enums/index';

export interface IHorizontalScrollerItemClickInfo {
	mediaType: EContent;
	id: string;
	title: string;
}

export interface IRelatedMedia {
	id: string;
	poster_path: string | undefined | null;
	title?: string;
	name?: string;
	popularity: number;
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
