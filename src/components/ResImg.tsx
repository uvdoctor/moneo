import React, { useEffect, useState } from 'react';
import { useFullScreenBrowser } from 'react-browser-hooks';
import { isMobileDevice } from './utils';
import Image from 'next/image';

interface ResImgProps {
	name: string;
	className?: string;
}

export default function ResImg({ name, className }: ResImgProps) {
	const fsb = useFullScreenBrowser();
	const [ imgPath, setImgPath ] = useState('/images/1x1.gif');

	useEffect(() => setImgPath(`/images/${name}${isMobileDevice(fsb) ? '-mobile' : ''}.jpg`), []);

	// return <Image className={className as string} src={imgPath} alt='' layout='responsive' width={width} height={height}/>;
	return <Image className={className as string} src={imgPath} alt='' fill sizes='(max-width: 768px) 100vw,
	(max-width: 1200px) 100vw, 100vw' priority />;
}
