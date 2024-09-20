
/**
 * Output model
 */
export interface Output {
	ontologyId: number;
	ontologyClass: string;
	ontologyAttribute: string;
	dataSourceId: number;
	dataSourceField?: string;
	dataSourceTable?: string;
	dataSourceColumn?: string;
}
