import React from 'react';
import { BlogInputProps } from '../Layout';

export default function ExpectedResults({ elements }: BlogInputProps) {
	return <ul>{elements.map((result: any) => (result ? <li>{result}</li> : null))}</ul>;
}
