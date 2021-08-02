import { Uri } from 'vscode';

/**
 * Cut off string if it's longer than **500** characters.
 */
export function truncateString(str: string): string {
	const charLimit = 500;
	return str.length > charLimit ? `${str.slice(0, charLimit)}…` : str;
}
/**
 * Replace linebreaks with the one whitespace symbol.
 */
export function replaceLinebreaks(str: string): string {
	return str.replace(/[\n\r\t]+?/g, ' ');
}
/**
 * Transform string svg to {@link Uri}
 */
export function svgToUri(svg: string): Uri {
	return Uri.parse(`data:image/svg+xml;utf8,${svg}`);
}
