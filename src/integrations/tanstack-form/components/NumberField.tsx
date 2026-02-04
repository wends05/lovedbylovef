import { Input } from "@/components/ui/input";
import { useFieldContext } from "../createFormHooks";
import { FieldWrapper } from "./FieldWrapper";

interface NumberFieldProps {
	label: string;
	description?: string;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

export default function NumberField({
	label,
	description,
	placeholder,
	className,
	disabled,
}: NumberFieldProps) {
	const field = useFieldContext<number>();
	return (
		<FieldWrapper label={label} description={description} className={className}>
			<Input
				id={field.name}
				value={field.state.value ?? ""}
				onChange={(e) => field.handleChange(e.target.valueAsNumber)}
				onBlur={field.handleBlur}
				placeholder={placeholder}
				type="number"
				disabled={disabled}
				aria-invalid={field.state.meta.errors.length > 0}
			/>
		</FieldWrapper>
	);
}
