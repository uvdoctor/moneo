const calc = {
	calcPFM: (name) => {
		if (name.includes('LIC')) return 'L';
		if (name.includes('HDFC')) return 'H';
		if (name.includes('SBI')) return 'S';
		if (name.includes('ADITYA')) return 'A';
		if (name.includes('ICICI')) return 'I';
		if (name.includes('UTI')) return 'U';
		if (name.includes('KOTAK')) return 'K';
	},
	calcST: (name) => {
		if (name.includes('TIER II')) return 'T2';
		if (name.includes('TIER I')) return 'T1';
		if (name.includes('LITE')) return 'Lite';
		if (name.includes('APY')) return 'APY';
		if (name.includes('STATE')) return 'SG';
		if (name.includes('CORPORATE-CG')) return 'CCG';
		if (name.includes('CENTRAL')) return 'CG';
	},
	calcType: (name) => {
		if (name.includes(' E ')) return 'E';
		if (
			name.includes('CORPORATE-CG') ||
			name.includes('STATE') ||
			name.includes('CENTRAL') ||
			name.includes(' C ') ||
			name.includes(' G ') ||
			name.includes(' A ')
		)
			return 'F';
		if (name.includes('TAX') || name.includes('LITE') || name.includes('APY')) return 'H';
	},
	calcSubType: (name) => {
		if (name.includes('STATE')) return 'GBO';
		if (name.includes('CENTRAL') || name.includes(' G ')) return 'GB';
		if (name.includes(' E ')) return 'S';
		if (name.includes('APY') || name.includes(' A ') || name.includes('TAX') || name.includes('LITE')) return 'HB';
		if (name.includes(' C ') || name.includes('CORPORATE-CG')) return 'CB';
	}
};

module.exports = calc;
