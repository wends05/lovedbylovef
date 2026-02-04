import { revalidateLogic } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	type UpdateRequestStatusInput,
	UpdateRequestStatusSchema,
} from "@/features/requests/schemas/UpdateRequestStatus";
import { RequestStatus } from "@/generated/prisma/enums";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { tryCatch } from "@/lib/try-catch";
import { adminDashboardOptions } from "../../options";
import {
	type AdminResponseFormData,
	AdminResponseSchema,
} from "../schemas/AdminResponse";

const useAdminResponseForm = (options: {
	requestId: string;
	onSubmit: (data: UpdateRequestStatusInput) => Promise<void>;
}) => {
	const defaultValues: AdminResponseFormData = {
		response: "",
		action: undefined,
	};
	const queryClient = useQueryClient();
	return useAppForm({
		defaultValues,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: AdminResponseSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			console.log(value);
			const parsedData = UpdateRequestStatusSchema.parse({
				adminResponse: value.response,
				requestId: options.requestId,
				status: value.action,
			});

			const { error } = await tryCatch(options.onSubmit(parsedData));
			if (error) {
				toast.error("Failed to process request", {
					description: error,
				});
				return;
			}

			// invalidate related queries - invalidate all admin request queries
			await queryClient.invalidateQueries({
				queryKey: ["adminRequests"],
			});
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
	onSubmit: (data: UpdateRequestStatusInput) => Promise<void>;
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
		form.handleSubmit();
	};

	const handleApprove = () => {
		form.setFieldValue("action", RequestStatus.APPROVED);
		// Small delay to ensure state is updated before submission
		setTimeout(() => form.handleSubmit(), 0);
		form.handleSubmit();
	};

	return (
		<div className="space-y-4 pt-4 border-t">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
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
