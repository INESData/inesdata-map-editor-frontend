import { FormGroup, FormControl, Validators } from '@angular/forms';

export const dataBaseSourceDtoForm = new FormGroup({
  connectionString: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ]),
  databaseType: new FormControl(null, [Validators.required]),
  id: new FormControl(null, []),
  name: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ]),
  password: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ]),
  type: new FormControl(null, []),
  userName: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ]),
  version: new FormControl(null, [])
});

export const dataSourceDtoForm = new FormGroup({
  id: new FormControl(null, []),
  name: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ]),
  type: new FormControl(null, []),
  version: new FormControl(null, [])
});

export const fileSourceDtoForm = new FormGroup({
  fileName: new FormControl(null, []),
  fileType: new FormControl(null, [Validators.required]),
  id: new FormControl(null, []),
  name: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ]),
  type: new FormControl(null, []),
  version: new FormControl(null, [])
});

export const linkForm = new FormGroup({
  href: new FormControl(null, []),
  templated: new FormControl(null, [])
});

export const ontologyDtoForm = new FormGroup({
  content: new FormControl(null, []),
  id: new FormControl(null, []),
  name: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ]),
  title: new FormControl(null, [
    Validators.minLength(0),
    Validators.maxLength(255)
  ]),
  uploadDate: new FormControl(null, []),
  url: new FormControl(null, [
    Validators.minLength(0),
    Validators.maxLength(255)
  ]),
  version: new FormControl(null, []),
  versionName: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ])
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

export const pageSearchMappingDtoForm = new FormGroup({
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

export const searchMappingDtoForm = new FormGroup({
  dataSources: new FormControl(null, []),
  id: new FormControl(null, []),
  name: new FormControl(null, []),
  ontologies: new FormControl(null, []),
  version: new FormControl(null, [])
});

export const searchOntologyDtoForm = new FormGroup({
  id: new FormControl(null, []),
  name: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ]),
  title: new FormControl(null, [
    Validators.minLength(0),
    Validators.maxLength(255)
  ]),
  uploadDate: new FormControl(null, []),
  url: new FormControl(null, [
    Validators.minLength(0),
    Validators.maxLength(255)
  ]),
  versionName: new FormControl(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(255)
  ])
});

export const sortObjectForm = new FormGroup({
  empty: new FormControl(null, []),
  sorted: new FormControl(null, []),
  unsorted: new FormControl(null, [])
});
