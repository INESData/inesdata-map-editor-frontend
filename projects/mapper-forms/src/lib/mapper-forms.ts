import { FormGroup, FormControl, Validators } from '@angular/forms';

export const linkForm = new FormGroup({
  href: new FormControl(null, []),
  templated: new FormControl(null, [])
});
