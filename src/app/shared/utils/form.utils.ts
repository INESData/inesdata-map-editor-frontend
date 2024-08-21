import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Create a form group from a dto
 * @param fb the form builder
 * @param group the form group
 * @returns the form group of the dto
 */
const createDtoForm = (fb: FormBuilder, group: FormGroup) => {

	/**
	 *  Clone the controls with their validators and initial values.
	 */
	const formGroupConfig = Object.keys(group.controls).reduce((config, key) => {
		// Get all control names, iterate over them and add to config
		const control = group.controls[key];
		config[key] = control;
		return config;
	}, {});

	// Create a new FormGroup with the same controls
	return fb.group(formGroupConfig);
};

export { createDtoForm };
