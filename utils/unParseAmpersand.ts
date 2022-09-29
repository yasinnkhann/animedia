export const unParseAmpersand = (str: string) => {
	return str.replace(/DASH/gi, '-').replace(/_ampersand_/gi, ' & ');
};
