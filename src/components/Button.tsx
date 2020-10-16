import React from "react";

interface ButtonProps {
	className?: string;
	children?: any;
	isPrimary?: boolean;
	disabled?: boolean;
	label?: string;
	isLoading?: boolean;
	onClick?: any;
}

export default function Button({
	className = "",
	children,
	isPrimary = true,
	label = "",
	isLoading = false,
	disabled = false,
	onClick = () => {},
}: ButtonProps) {
	const cssClass = `${isPrimary ? "primary" : "secondary"} ${
		isLoading ? "loading" : ""
	} ${className}`;
	return (
		<button
			className={cssClass}
			disabled={disabled}
			onClick={isLoading ? () => {} : onClick}
		>
			{children ? children : label}
		</button>
	);
}
