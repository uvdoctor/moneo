import React, { useEffect, useState } from 'react';
import { useFullScreenBrowser } from 'react-browser-hooks';
import { isMobileDevice } from './utils';

interface ResImgProps {
	name: string;
	className?: string;
}

export default function ResImg({ name, className }: ResImgProps) {
	const fsb = useFullScreenBrowser();
	const [ imgPath, setImgPath ] = useState('images/1x1.gif');

	useEffect(() => setImgPath(`images/${name}${isMobileDevice(fsb) ? '-mobile' : ''}.jpg`), []);

	return <img className={className as string} src={imgPath} />;
}
