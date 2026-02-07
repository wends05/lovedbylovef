import { OrderStatus } from "@/generated/prisma/enums";

export const USER_ORDER_STATUS_TABS = [
	{ value: "ALL", label: "All" },
	{ value: OrderStatus.PENDING, label: "Pending" },
	{ value: OrderStatus.PROCESSING, label: "Processing" },
	{ value: OrderStatus.DELIVERED, label: "Delivered" },
	{ value: OrderStatus.CANCELED, label: "Canceled" },
] as const;
