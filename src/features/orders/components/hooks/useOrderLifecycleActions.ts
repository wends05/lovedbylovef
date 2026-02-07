import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDashboardQueryOptions } from "@/features/admin/options";
import { chatQueryOptions } from "@/features/chat/options";
import { requestsQueryOptions } from "@/features/requests/options";
import { toast } from "sonner";
import { OrderStatus } from "@/generated/prisma/enums";
import { tryCatch } from "@/lib/try-catch";
import { ORDERS_PAGE_SIZE } from "../../constants";
import { ordersMutationOptions, ordersQueryOptions } from "../../options";
import type { GetOrdersQueryInput } from "../../admin/schemas/GetOrdersQuery";
import type { GetUserOrdersInput } from "../../user/schemas/GetUserOrders";
import { userOrdersQueryOptions } from "../../user/options";

type BaseActionInput = {
	orderId: string;
	requestId: string;
	onSuccess?: () => void;
};

type MarkProcessingInput = BaseActionInput & {
	totalPrice: number;
};

export function useOrderLifecycleActions() {
	const queryClient = useQueryClient();
	const updateOrderLifecycleMutation = useMutation(
		ordersMutationOptions.updateOrderLifecycle,
	);

	const invalidateOrderQueries = async (orderId: string, requestId: string) => {
		const adminOrderStatuses: Array<GetOrdersQueryInput["status"]> = [
			"ALL",
			OrderStatus.PENDING,
			OrderStatus.PROCESSING,
			OrderStatus.DELIVERED,
			OrderStatus.CANCELED,
		];
		const userOrderStatuses: Array<GetUserOrdersInput["status"]> = [
			"ALL",
			OrderStatus.PENDING,
			OrderStatus.PROCESSING,
			OrderStatus.DELIVERED,
			OrderStatus.CANCELED,
		];

		await Promise.all([
			...adminOrderStatuses.map((status) =>
				queryClient.invalidateQueries(
					adminDashboardQueryOptions.getOrders({
						pageSize: ORDERS_PAGE_SIZE,
						status,
					}),
				),
			),
			...userOrderStatuses.map((status) =>
				queryClient.invalidateQueries(
					userOrdersQueryOptions.getUserOrdersInfinite({
						pageSize: ORDERS_PAGE_SIZE,
						status,
					}),
				),
			),
			queryClient.invalidateQueries(chatQueryOptions.getChatData(orderId)),
			queryClient.invalidateQueries(
				adminDashboardQueryOptions.getAdminDashboardData,
			),
			queryClient.invalidateQueries(requestsQueryOptions.getRequestById(requestId)),
			queryClient.invalidateQueries(ordersQueryOptions.getOrderById(orderId)),
		]);
	};

	const markAsProcessing = async ({
		orderId,
		requestId,
		totalPrice,
		onSuccess,
	}: MarkProcessingInput) => {
		const { success, error } = await tryCatch(
			updateOrderLifecycleMutation.mutateAsync({
				data: {
					orderId,
					nextStatus: OrderStatus.PROCESSING,
					totalPrice,
				},
			}),
		);

		if (!success) {
			toast.error("Failed to update order", {
				description: error ?? "Something went wrong.",
			});
			return false;
		}

		toast.success("Order moved to processing.");
		await invalidateOrderQueries(orderId, requestId);
		onSuccess?.();
		return true;
	};

	const markAsDelivered = async ({
		orderId,
		requestId,
		onSuccess,
	}: BaseActionInput) => {
		const { success, error } = await tryCatch(
			updateOrderLifecycleMutation.mutateAsync({
				data: {
					orderId,
					nextStatus: OrderStatus.DELIVERED,
				},
			}),
		);

		if (!success) {
			toast.error("Failed to update order", {
				description: error ?? "Something went wrong.",
			});
			return false;
		}

		toast.success("Order marked as delivered.");
		await invalidateOrderQueries(orderId, requestId);
		onSuccess?.();
		return true;
	};

	return {
		isUpdating: updateOrderLifecycleMutation.isPending,
		markAsProcessing,
		markAsDelivered,
	};
}
