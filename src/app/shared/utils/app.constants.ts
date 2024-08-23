import { marker as translate } from '@colsen1991/ngx-translate-extract-marker';

/**
 * Global constants
 */

// Language
export const DEFAULT_LANGUAGE: string = 'es';
export const AVAILABLE_LANGUAGES: Array<string> = ['es', 'en'];
export const LANGUAGE_STORAGE_NAME: string = 'language';

// Filters
export const PAGE: number = 0;
export const SIZE: number = 10;
export const SORT_BY_NAME: string = 'name';

// Messages
export const MESSAGES_SUCCESS: string = translate('messages.success');
export const MESSAGES_ERRORS: string = translate('messages.errors.title');
export const MESSAGES_ERRORS_GENERIC: string = translate('messages.errors.generic');
export const MESSAGES_ERRORS_INTERNET_CONNECTION: string = translate('messages.errors.internet.connection');
export const MESSAGES_ERRORS_LOGIN: string = translate('messages.errors.login');
export const MESSAGES_ERRORS_REQUIRED: string = translate('messages.errors.required');

export const MESSAGES_ONTOLOGIES_SUCCESS_CREATED: string = translate('messages.ontologies.success.created');
export const MESSAGES_ONTOLOGIES_SUCCESS_UPDATED: string = translate('messages.ontologies.success.updated');
export const MESSAGES_ONTOLOGIES_SUCCESS_DELETED: string = translate('messages.ontologies.success.deleted');

export const MESSAGES_DATA_SOURCES_SUCCESS_CREATED: string = translate('messages.data-sources.success.created');
export const MESSAGES_DATA_SOURCES_SUCCESS_UPDATED: string = translate('messages.data-sources.success.updated');
export const MESSAGES_DATA_SOURCES_SUCCESS_DELETED: string = translate('messages.data-sources.success.deleted');

// Labels
export const LABELS_YES: string = translate('labels.yes');
export const LABELS_NO: string = translate('labels.no');
export const LABELS_HOME: string = translate('labels.home');
export const LABELS_NO_FILE_SELECTED: string = translate('labels.file-name');

// Placeholders
export const PLACEHOLDERS_ASTERISKS_MASK: string = '****';

//Ontologies
export const ONTOLOGIES_ADD_ONTOLOGY: string = translate('ontologies.ontology.add');
export const ONTOLOGIES_EDIT_ONTOLOGY: string = translate('ontologies.ontology.edit');

//Data sources
export const DATA_SOURCES_ADD_DATA_SOURCE: string = translate('data-sources.data-source.add');
export const DATA_SOURCES_EDIT_DATA_SOURCE: string = translate('data-sources.data-source.edit');
export const DATA_SOURCES_DATA_BASE_TYPE: string = 'databaseType';
export const DATA_SOURCES_FILE_TYPE: string = 'fileType';



// Routes
export const HOME: string = '/home';

// Sidebar
export const SIDEBAR_LABELS_ONTOLOGIES: string = translate('sidebar.labels.ontologies');
export const SIDEBAR_LABELS_DATASOURCES: string = translate('sidebar.labels.data-sources');
export const SIDEBAR_LABELS_MAPPINGS: string = translate('sidebar.labels.mappings');

