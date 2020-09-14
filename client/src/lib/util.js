export const removePunctuation = (string) => {
	let regex = /[!"#$%&()*+,./:;<=>?@[\]^_`{|}~]/g;
	return string.replace(regex, ' ');
};

export const copyText = () => {
	let area = document.getElementById('json');
	let text = area.textContent;
	let dummy = document.createElement('textarea');
	document.body.appendChild(dummy);
	dummy.value = text;
	dummy.select();
	document.execCommand('copy');
	document.body.removeChild(dummy);
};
