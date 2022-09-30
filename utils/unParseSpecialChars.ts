export const unParseSpecialChars = (str: string) => {
	return str.replace(/DASH/gi, '-').replace(/_ampersand_/gi, ' & ');
};
