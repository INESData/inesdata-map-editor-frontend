import { FormGroup, FormControl, Validators } from '@angular/forms';

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

export const searchOntologyDtoForm = new FormGroup({
  name: new FormControl(null, []),
  title: new FormControl(null, []),
  uploadDate: new FormControl(null, []),
  url: new FormControl(null, []),
  versionName: new FormControl(null, [])
});
