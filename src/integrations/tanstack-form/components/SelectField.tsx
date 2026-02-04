import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	return (
		<FieldWrapper label={label} description={description} className={className}>
			<Select disabled={disabled}>
				<SelectTrigger>
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
