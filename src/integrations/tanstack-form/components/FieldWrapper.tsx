"use client";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFieldContext } from "../createFormHooks";

interface FieldWrapperProps {
	label: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
}

export function FieldWrapper({
	label,
	description,
	children,
	className,
}: FieldWrapperProps) {
	const field = useFieldContext();

	const hasError = field.state.meta.errors.length > 0;

	return (
		<Field data-invalid={hasError} className={cn("space-y-1", className)}>
			<FieldLabel>
				<Label htmlFor={field.name}>
					<FieldTitle>{label}</FieldTitle>
				</Label>
			</FieldLabel>
			<FieldContent>
				{children}
				{description && <FieldDescription>{description}</FieldDescription>}
				<FieldError errors={field.state.meta.errors} />
			</FieldContent>
		</Field>
	);
}
