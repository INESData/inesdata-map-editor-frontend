import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filters a list based on a search text. Object and string arrays
 */
@Pipe({
	name: 'filterList',
	standalone: true
})
export class FilterListPipe implements PipeTransform {

	transform<T>(list: T[], searchText: string, key?: keyof T): T[] {
		if (!list || !searchText) {
			return list;
		}
		searchText = searchText.toLowerCase();
		return list.filter(item => {
			if (typeof item === 'string') {
				// If the list contains strings
				return item.toLowerCase().includes(searchText);
			} else if (key && item[key]) {
				// If the list contains objects
				return String(item[key]).toLowerCase().includes(searchText);
			}
			return false;
		});
	}
}
