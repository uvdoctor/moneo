const calcInd = (name) => {
	name = name.toLowerCase().trim();
	if (name.includes('basic materials')) return 'BASM';
	if (name.includes('consumer durables')) return 'CD';
	if (name.includes('energy')) return 'E';
	if (name.includes('fast moving') || name.includes('fmcg')) return 'CG';
	if (name.includes('financ') || name.includes('bank') || name.includes('psu bank') || name.includes('private bank'))
		return 'F';
	if (name.includes('healthcare')) return 'H';
	if (name.includes('pharma')) return 'PH';
	if (name.includes('industrials')) return 'IM';
	if (name.includes('technology') || name.includes('nifty it')) return 'IT';
	if (name.includes('telecom')) return 'TC';
	if (name.includes('utilities')) return 'U';
	if (name.includes('auto')) return 'A';
	if (name.includes('capital goods')) return 'CAPG';
	if (name.includes('discretionary goods')) return 'CDGS';
	if (name.includes('metal')) return 'MET';
	if (name.includes('media')) return 'MED';
	if (name.includes('oil')) return 'OG';
	if (name.includes('power')) return 'POW';
	if (name.includes('realty')) return 'C';
	if (name.includes('teck')) return 'TECH';
	return null;
};

const calcType = (name) => {
	if (name.includes('G-Sec')) return 'F';
	return 'E';
};

const calcSubType = (name) => {
	if (name.includes('G-Sec')) return 'GB';
	return 'S';
};

const calcPrevPrice = (currentPrice, chg) => {
	const percent = (100 + chg)/100;
	const prev = currentPrice/percent;
	return isNaN(prev) ? 0 : Math.round(prev * 100) / 100; 
}

module.exports = { calcInd, calcType, calcSubType, calcPrevPrice };
