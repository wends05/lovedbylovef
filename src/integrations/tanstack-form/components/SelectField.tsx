import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "../createFormHooks";
import { FieldWrapper } from "./FieldWrapper";

interface Item {
	value: string;
	label: string;
}

interface SelectFieldProps {
	items: Item[];
	label: string;
	description?: string;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}
export default function SelectField({
	items,
	label,
	description,
	placeholder,
	className,
	disabled,
}: SelectFieldProps) {
	const field = useFieldContext<string>();
	return (
		<FieldWrapper label={label} description={description} className={className}>
			<Select
				disabled={disabled}
				value={field.state.value ?? ""}
				onValueChange={(value) => field.handleChange(value)}
			>
				<SelectTrigger aria-invalid={field.state.meta.errors.length > 0}>
					<SelectValue placeholder={placeholder}>
						{(value) =>
							items.find((item) => item.value === value)?.label || placeholder
						}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{items.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FieldWrapper>
	);
}
