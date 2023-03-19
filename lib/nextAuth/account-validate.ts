import { isValidEmail } from '../../utils/isValidEmail';
import { ILogin, IRegister } from '@ts/interfaces';

function validatePassword(password: string) {
	const errors: string[] = [];

	if (!password) {
		errors.push('Password Required!');
	} else if (password.trim().length < 8 || password.trim().length > 20) {
		errors.push('Password must be between 8 and 20 characters long!');
	} else if (password.includes(' ')) {
		errors.push('Password cannot contain spaces!');
	}

	return errors;
}

function validateEmail(email: string) {
	const errors: string[] = [];

	if (!email) {
		errors.push('Email Required!');
	} else if (!isValidEmail(email)) {
		errors.push('Invalid Email!');
	}

	return errors;
}

export const loginValidate = (values: ILogin) => {
	const errors: Partial<ILogin> = {};

	const emailErrors = validateEmail(values.email);

	if (emailErrors.length > 0) {
		errors.email = emailErrors[0];
	}

	const passwordErrors = validatePassword(values.password);

	if (passwordErrors.length > 0) {
		errors.password = passwordErrors[0];
	}

	return errors;
};

export const registerValidate = (values: IRegister) => {
	const errors: Partial<IRegister> = {};

	const nameErrors = values.name ? [] : ['Name Required!'];

	if (nameErrors.length > 0) {
		errors.name = nameErrors[0];
	}

	const emailErrors = validateEmail(values.email);

	if (emailErrors.length > 0) {
		errors.email = emailErrors[0];
	}

	const passwordErrors = validatePassword(values.password);

	if (passwordErrors.length > 0) {
		errors.password = passwordErrors[0];
	}

	if (values.password && values.confirmPassword) {
		if (values.password !== values.confirmPassword) {
			errors.confirmPassword = 'Passwords Do Not Match!';
		} else if (values.confirmPassword.includes(' ')) {
			errors.confirmPassword = 'Invalid Confirm Password!';
		}
	} else {
		errors.confirmPassword = 'Please confirm your password!';
	}

	return errors;
};
