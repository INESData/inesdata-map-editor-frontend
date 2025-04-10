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
				return item.toLowerCase().startsWith(searchText);
			} else if (key && item[key]) {
				// If the list contains objects
				const value = String(item[key]).toLowerCase();
				//In case of properties with prefix, filter by the value after the prefix
				const filteredValue = value.includes(':') ? value.split(':')[1] : value;
				return value.startsWith(searchText) || filteredValue.startsWith(searchText);
			}
			return false;
		});
	}
}
