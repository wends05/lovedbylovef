"use client";

import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "../createFormHooks";
import { FieldWrapper } from "./FieldWrapper";

interface TextareaFieldProps {
	label: string;
	description?: string;
	placeholder?: string;
	className?: string;
	rows?: number;
	disabled?: boolean;
}

export function TextareaField({
	label,
	description,
	placeholder,
	className,
	rows,
	disabled,
}: TextareaFieldProps) {
	const field = useFieldContext();

	return (
		<FieldWrapper label={label} description={description} className={className}>
			<Textarea
				id={field.name}
				value={(field.state.value as string) ?? ""}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				placeholder={placeholder}
				rows={rows}
				disabled={disabled}
				aria-invalid={field.state.meta.errors.length > 0}
			/>
		</FieldWrapper>
	);
}
