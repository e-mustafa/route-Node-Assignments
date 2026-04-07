/**
 * @param {number[]} nums
 * @return {number}
 */
const majorityElement = function (nums = []) {
	let count = 0;
	let maj = null;

	for (let e of nums) {
		count == 0 && (maj = e);

		count += e == maj ? 1 : -1;
	}

	return maj;
};
