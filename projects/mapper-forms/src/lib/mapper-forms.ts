import { FormControl, FormGroup } from '@angular/forms';

export const dataSourceDtoForm = new FormGroup({
	connectionString: new FormControl(null, []),
	databaseType: new FormControl(null, []),
	fields: new FormControl(null, []),
	fileName: new FormControl(null, []),
	fileType: new FormControl(null, []),
	id: new FormControl(null, []),
	name: new FormControl(null, []),
	password: new FormControl(null, []),
	type: new FormControl(null, []),
	userName: new FormControl(null, []),
	version: new FormControl(null, [])
});

export const linkForm = new FormGroup({
	href: new FormControl(null, []),
	templated: new FormControl(null, [])
});

export const ontologyDtoForm = new FormGroup({
	content: new FormControl(null, []),
	id: new FormControl(null, []),
	name: new FormControl(null, []),
	title: new FormControl(null, []),
	uploadDate: new FormControl(null, []),
	url: new FormControl(null, []),
	version: new FormControl(null, []),
	versionName: new FormControl(null, [])
});

export const pageDataSourceDtoForm = new FormGroup({
	content: new FormControl(null, []),
	empty: new FormControl(null, []),
	first: new FormControl(null, []),
	last: new FormControl(null, []),
	number: new FormControl(null, []),
	numberOfElements: new FormControl(null, []),
	pageable: new FormControl(null, []),
	size: new FormControl(null, []),
	sort: new FormControl(null, []),
	totalElements: new FormControl(null, []),
	totalPages: new FormControl(null, [])
});

export const pageSearchOntologyDtoForm = new FormGroup({
	content: new FormControl(null, []),
	empty: new FormControl(null, []),
	first: new FormControl(null, []),
	last: new FormControl(null, []),
	number: new FormControl(null, []),
	numberOfElements: new FormControl(null, []),
	pageable: new FormControl(null, []),
	size: new FormControl(null, []),
	sort: new FormControl(null, []),
	totalElements: new FormControl(null, []),
	totalPages: new FormControl(null, [])
});

export const pageableObjectForm = new FormGroup({
	offset: new FormControl(null, []),
	pageNumber: new FormControl(null, []),
	pageSize: new FormControl(null, []),
	paged: new FormControl(null, []),
	sort: new FormControl(null, []),
	unpaged: new FormControl(null, [])
});

export const searchOntologyDtoForm = new FormGroup({
	id: new FormControl(null, []),
	name: new FormControl(null, []),
	title: new FormControl(null, []),
	uploadDate: new FormControl(null, []),
	url: new FormControl(null, []),
	versionName: new FormControl(null, [])
});

export const sortObjectForm = new FormGroup({
	empty: new FormControl(null, []),
	sorted: new FormControl(null, []),
	unsorted: new FormControl(null, [])
});
