import { revalidateLogic } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { requestsMutationOptions } from "@/features/requests/options";
import { UpdateRequestStatusSchema } from "@/features/requests/schemas/UpdateRequestStatus";
import { RequestStatus } from "@/generated/prisma/enums";
import { useAppForm } from "@/integrations/tanstack-form/formHooks";
import { tryCatch } from "@/lib/try-catch";
import { adminDashboardQueryOptions } from "../../options";
import {
	type AdminResponseFormData,
	AdminResponseSchema,
} from "../schemas/AdminResponse";

const useAdminResponseForm = (options: { requestId: string }) => {
	const updateRequestStatusMutation = useMutation(
		requestsMutationOptions.updateRequestStatus,
	);
	const defaultValues: AdminResponseFormData = {
		response: undefined,
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
			const parsedData = UpdateRequestStatusSchema.parse({
				adminResponse: value.response,
				requestId: options.requestId,
				status: value.action,
			});

			const { error } = await tryCatch(
				updateRequestStatusMutation.mutateAsync({
					data: parsedData,
				}),
			);
			if (error) {
				toast.error(`Failed to process request: ${error}`);
				return;
			}

			toast.success(`Request ${parsedData.status.toLowerCase()} successfully!`);

			// invalidate related queries - invalidate all admin request queries
			await queryClient.invalidateQueries(
				adminDashboardQueryOptions.getAdminDashboardData,
			);

			// cant pass in queryKey with filters here since we dont have access to them, so just invalidate all admin request queries
			await queryClient.invalidateQueries({
				queryKey: ["adminRequests"],
			});

			// Success! Clear the form
			formApi.reset();
		},
	});
};

interface RequestResponseFormProps {
	requestId: string;
	isSubmitting: boolean;
}

export function RequestResponseForm({
	requestId,
	isSubmitting,
}: RequestResponseFormProps) {
	const form = useAdminResponseForm({
		requestId,
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
					<Button type="button" onClick={handleApprove} disabled={isSubmitting}>
						<Check className="h-4 w-4 mr-2" />
						Approve
					</Button>
				</div>
			</form>
		</div>
	);
}
