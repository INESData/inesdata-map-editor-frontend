import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Create a form group from a dto
 * @param fb the form builder
 * @param group the form group
 * @returns the form group of the dto
 */
const createDtoForm = (fb: FormBuilder, group: FormGroup) => {
	return fb.group(group.getRawValue());
};

export { createDtoForm };
