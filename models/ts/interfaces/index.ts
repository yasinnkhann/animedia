import { ESearchType } from '../enums/index';

export interface IHorizontalScrollerItemClickInfo {
	mediaType: ESearchType;
	id: number;
	title: string;
}

export interface IKnownForMedia {
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

export interface INodeMailerInfo {
	recipientEmail: string;
	subject: string;
	text: string;
	html: string;
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
