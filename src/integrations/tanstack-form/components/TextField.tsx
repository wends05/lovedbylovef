"use client";

import { Input } from "@/components/ui/input";
import { useFieldContext } from "../createFormHooks";
import { FieldWrapper } from "./FieldWrapper";

interface TextFieldProps {
	label: string;
	description?: string;
	placeholder?: string;
	className?: string;
	type?: React.ComponentProps<"input">["type"];
	disabled?: boolean;
}

export function TextField({
	label,
	description,
	placeholder,
	className,
	type = "text",
	disabled,
}: TextFieldProps) {
	const field = useFieldContext();

	return (
		<FieldWrapper label={label} description={description} className={className}>
			<Input
				id={field.name}
				type={type}
				value={(field.state.value as string) ?? ""}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={field.state.meta.errors.length > 0}
			/>
		</FieldWrapper>
	);
}
