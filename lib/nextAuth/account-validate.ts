import { CommonMethods } from '../../utils/CommonMethods';
import { ILogin, IRegister } from '@ts/interfaces';
import _ from 'lodash';

function validatePassword(password: string) {
	const errors: string[] = [];

	if (!password) {
		errors.push('Password Required!');
	} else if (password.trim().length < 8) {
		errors.push('Password must be at least 8 characters long!');
	} else if (password.includes(' ')) {
		errors.push('Password cannot contain spaces!');
	}

	return errors;
}

function validateEmail(email: string) {
	const errors: string[] = [];

	if (!email) {
		errors.push('Email Required!');
	} else if (!CommonMethods.isValidEmail(email)) {
		errors.push('Invalid Email!');
	}

	return errors;
}

export const loginValidate = async (values: ILogin) => {
	const errors: Partial<ILogin> = {};

	const emailErrors = validateEmail(values.email);

	if (!_.isEmpty(emailErrors)) {
		errors.email = emailErrors[0];
	}

	const passwordErrors = validatePassword(values.password);

	if (!_.isEmpty(passwordErrors)) {
		errors.password = passwordErrors[0];
	}

	return errors;
};

export const registerValidate = async (values: IRegister) => {
	const errors: Partial<IRegister> = {};

	const nameErrors = values.name ? [] : ['Name Required!'];

	if (!_.isEmpty(nameErrors)) {
		errors.name = nameErrors[0];
	}

	const emailErrors = validateEmail(values.email);

	if (!_.isEmpty(emailErrors)) {
		errors.email = emailErrors[0];
	}

	const passwordErrors = validatePassword(values.password);

	if (!_.isEmpty(passwordErrors)) {
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

export const forgotPasswordValidate = (values: { email: string }) => {
	const errors: Partial<Omit<ILogin, 'password'>> = {};
	const emailErrors = validateEmail(values.email);
	if (!_.isEmpty(emailErrors)) {
		errors.email = emailErrors[0];
	}
	return errors;
};

export const newPasswordValidate = (values: { newPassword: string }) => {
	const errors: Partial<typeof values> = {};
	const newPasswordErrors = validatePassword(values.newPassword);
	if (!_.isEmpty(newPasswordErrors)) {
		errors.newPassword = newPasswordErrors[0];
	}
	return errors;
};
