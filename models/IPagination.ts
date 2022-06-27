import { IItems } from './IItems';

export interface IPagination {
	last_visible_page: number;
	has_next_page: boolean;
	current_page: number;
	items: IItems;
}
