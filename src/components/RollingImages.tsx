import React, { useEffect, useState } from 'react';
import { HomeOutlined, CarOutlined, SketchOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

require('./RollingImages.less');

export default function RollingImages() {
	const [ svgCtr, setSvgCtr ] = useState(-1);

	useEffect(
		() => {
			let timer = setTimeout(() => {
				setSvgCtr(svgCtr + 1);
			}, 2000);

			return () => clearInterval(timer);
		},
		[ svgCtr ]
	);

	return svgCtr % 5 === 0 ? (
		<HomeOutlined />
	) : svgCtr % 5 === 1 ? (
		<CarOutlined />
	) : svgCtr % 5 === 2 ? (
		<SketchOutlined />
	) : svgCtr % 5 === 3 ? (
		<ShoppingCartOutlined />
	) : (
		<HeartOutlined />
	);
}
