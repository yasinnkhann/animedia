import { IAnime } from './IAnime';
import { IMetaLink } from './IMetaLink';
import { IPagination } from './IPagination';
import { ILinks } from './ILinks';
import { IMeta } from './IMeta';

export interface IFetchedAPI {
	pagination: IPagination;
	data: IAnime[];
	links: ILinks;
	meta: IMeta;
}
