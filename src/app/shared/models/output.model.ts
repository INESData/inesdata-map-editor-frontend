
/**
 * Output model
 */
export interface Output {
	ontologyId: number;
	ontologyUrl: string;
	ontologyClass: string;
	ontologyAttribute: string;
	dataSourceId: number;
	dataSourceField?: string;
	dataSourceTable?: string;
	dataSourceColumn?: string;
}
