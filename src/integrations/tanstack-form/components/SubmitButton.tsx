"use client";

import { Button } from "@/components/ui/button";
import { useFormContext } from "../createFormHooks";

interface SubmitButtonProps {
	label: string;
	isSubmittingLabel?: string;
	className?: string;
	disabled?: boolean;
}

export function SubmitButton({
	label,
	isSubmittingLabel = "Submitting...",
	className,
	disabled,
}: SubmitButtonProps) {
	const form = useFormContext();
	return (
		<form.Subscribe
			selector={(state) => ({
				submitting: state.isSubmitting,
			})}
		>
			{(state) => {
				const { submitting } = state;
				return (
					<Button
						type="submit"
						disabled={disabled || submitting}
						aria-disabled={disabled || submitting}
						data-submitting={submitting}
						className={className}
					>
						{submitting ? isSubmittingLabel : label}
					</Button>
				);
			}}
		</form.Subscribe>
	);
}
