/**
 * @param {string[]} strings
 * @return {string}
 */
const longestCommonPrefix = function (strings) {
	if (!strings.length) return '';

	let prefix = strings[0];

	for (let e of strings) {
		while (!e.startsWith(prefix)) {
			prefix = prefix.slice(0, -1);
		}

		if (prefix == '') return '';
	}
	return prefix;
};

console.log(longestCommonPrefix(['flower', 'flow', 'flight']));
console.log(longestCommonPrefix(['dog', 'racecar', 'car']));
