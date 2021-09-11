const getAssetType = (element) => {
	const sType = element['Scheme Type'];
	const sName = element['Scheme Name'];
	if (sType.includes('Hybrid')) return 'H';
	if (
		sType.includes('Debt') ||
		sType.includes('Income') ||
		sType.includes('Solution') ||
		sType.includes('Gilt') ||
		(sType.includes('Index') && (sName.includes('Gilt') || sName.includes('Bond')))
	)
		return 'F';
	if (sType.includes('Other')) return 'A';
	return 'E';
};

const getAssetSubType = (element) => {
	const sType = element['Scheme Type'];
	const sName = element['Scheme Name'];
	if (
		sType.includes('Debt Scheme') &&
		(sType.includes('Liquid') || sType.includes('Money Market') || sType.includes('Overnight'))
	)
		return 'L';
	if (
		sType.includes('Debt Scheme') &&
		(sName.includes('Government') || sName.includes('Treasury') || sName.includes('Gilt') || sName.includes('GILT'))
	)
		return 'GB';
	if (sType.includes('Debt Scheme')) return 'CB';
	if (sType.includes('Index')) return 'I';
	if (sType.includes('Gilt')) return 'GB';
	if ((sType.includes('Close') || sType.includes('Interval')) && sType.includes('Income')) return 'HB';
	return 'S';
};

const mfType = (data) => {
	if (data.includes('Open')) return 'O';
	if (data.includes('Close')) return 'C';
	if (data.includes('Interval')) return 'I';
};

module.exports = {
    getAssetType,
    getAssetSubType,
    mfType
};