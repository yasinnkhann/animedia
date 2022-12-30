import { ESearchType } from '../enums/index';

export interface IHorizontalScrollerItemClickInfo {
	mediaType: ESearchType.MOVIE | ESearchType.SHOW | ESearchType.PERSON;
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
