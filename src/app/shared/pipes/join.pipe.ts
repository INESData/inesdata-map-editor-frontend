import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe: array to | delimiter
 *
 * Converts an array separated by commas into a | delimitaer string
 */
@Pipe({
	name: 'join',
	standalone: true
})
export class JoinPipe implements PipeTransform {

	/**
	 * Transforms an array to | string without duplicates
	 *
	 * @param value the array
	 * @returns transformed array string
	 */
	transform(value: string[], delimiter = ' | '): string {
		return Array.isArray(value) ? [...new Set(value)].join(delimiter) : value;
	}

}
