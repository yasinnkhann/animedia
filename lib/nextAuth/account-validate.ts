export default async function loginValidate(values: any) {
	const errors: any = {};

	if (!values.email) {
		errors.email = 'Email Required';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid Email';
	}

	// validation for password
	if (!values.password) {
		errors.password = 'Password Required';
	} else if (values.password.length < 8 || values.password.length > 20) {
		errors.password = 'Must be greater then 8 and less then 20 characters long';
	} else if (values.password.includes(' ')) {
		errors.password = 'Invalid Password';
	}

	return errors;
}

export function registerValidate(values: any) {
	const errors: any = {};

	if (!values.name) {
		errors.name = 'Name Required';
	}

	if (!values.email) {
		errors.email = 'Email Required';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid Email';
	}

	// validation for password
	if (!values.password) {
		errors.password = 'Password Required';
	} else if (values.password.length < 8 || values.password.length > 20) {
		errors.password = 'Must be greater then 8 and less then 20 characters long';
	} else if (values.password.includes(' ')) {
		errors.password = 'Invalid Password';
	}

	// validate confirm password
	if (!values.confirmPassword) {
		errors.confirmPassword = 'Please confirm your password';
	} else if (values.password !== values.confirmPassword) {
		errors.confirmPassword = 'Passwords Do Not Match!';
	} else if (values.confirmPassword.includes(' ')) {
		errors.confirmPassword = 'Invalid Confirm Password';
	}

	return errors;
}
