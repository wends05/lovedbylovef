import { revalidateLogic } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/generated/prisma/enums";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { tryCatch } from "@/lib/try-catch";
import { adminDashboardOptions } from "../../options";
import {
	type AdminResponseFormData,
	AdminResponseSchema,
} from "./schemas/AdminResponse";

const useAdminResponseForm = (options: {
	requestId: string;
	onSubmit: (data: AdminResponseFormData) => Promise<void>;
}) => {
	const queryClient = useQueryClient();
	return useAppForm({
		defaultValues: {
			response: "",
			action: undefined as unknown as AdminResponseFormData["action"],
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: AdminResponseSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			const { error } = await tryCatch(options.onSubmit(value));
			if (error) {
				toast.error("Failed to process request", {
					description: error,
				});
				return;
			}

			// invalidate related queries
			await queryClient.invalidateQueries(adminDashboardOptions.getRequests);
			await queryClient.invalidateQueries(
				adminDashboardOptions.getAdminDashboardData,
			);

			// Success! Clear the form
			formApi.reset();
		},
	});
};

interface RequestResponseFormProps {
	requestId: string;
	isSubmitting: boolean;
	onSubmit: (data: AdminResponseFormData) => Promise<void>;
}

export function RequestResponseForm({
	requestId,
	isSubmitting,
	onSubmit,
}: RequestResponseFormProps) {
	const form = useAdminResponseForm({
		requestId,
		onSubmit,
	});

	const handleReject = () => {
		form.setFieldValue("action", RequestStatus.REJECTED);
		// Small delay to ensure state is updated before submission
		setTimeout(() => form.handleSubmit(), 0);
	};

	const handleApprove = () => {
		form.setFieldValue("action", RequestStatus.APPROVED);
		// Small delay to ensure state is updated before submission
		setTimeout(() => form.handleSubmit(), 0);
	};

	return (
		<div className="space-y-4 pt-4 border-t">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.AppField name="response">
					{(field) => (
						<field.TextareaField
							label="Response to User"
							placeholder="Enter your response to the user (optional)"
							rows={3}
						/>
					)}
				</form.AppField>

				<div className="flex gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={handleReject}
						disabled={isSubmitting}
					>
						<X className="h-4 w-4 mr-2" />
						Reject
					</Button>
					<Button onClick={handleApprove} disabled={isSubmitting}>
						<Check className="h-4 w-4 mr-2" />
						Approve
					</Button>
				</div>
			</form>
		</div>
	);
}
