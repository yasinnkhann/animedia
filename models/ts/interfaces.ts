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
	character?: string;
	profile_path: string | null;
	type: string;
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

export interface IGamePreview {
	id: string;
	game: string;
	url?: string | null;
	video_id?: string | null;
	name?: string | null;
	videoUrl?: string | null;
}

export interface ICurrentSeasonEpisode {
	seasonNo: string;
	episode: string;
}
