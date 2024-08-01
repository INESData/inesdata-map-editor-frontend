/**
 * com.inesdata-map:mapper-backend
 * Service responsible for saving a data source mapping and generating the corresponding R2RML / RML mapping file
 *
 * The version of the OpenAPI document: 1.0.0-SNAPSHOT
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HttpHeaders }                                       from '@angular/common/http';

import { Observable }                                        from 'rxjs';



import { Configuration }                                     from '../configuration';



export interface DataBaseSourceServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Get column names for a database table
     * Retrieves a list of column names for the specified table name and a data source ID.
     * @param id 
     * @param table 
     */
    getColumnNames(id: number, table: string, extraHttpRequestParams?: any): Observable<Array<string>>;

    /**
     * Get table names for a database source
     * Retrieves a list of table names for the specified data source ID.
     * @param id 
     */
    getTableNames(id: number, extraHttpRequestParams?: any): Observable<Array<string>>;

}
