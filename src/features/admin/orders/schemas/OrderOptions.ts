import { OrderStatus } from "@/generated/prisma/enums";

export const ORDER_STATUS_TABS = [
	{ value: "ALL", label: "All" },
	{ value: OrderStatus.PENDING, label: "Pending" },
	{ value: OrderStatus.PROCESSING, label: "Processing" },
	{ value: OrderStatus.DELIVERED, label: "Delivered" },
	{ value: OrderStatus.CANCELED, label: "Canceled" },
] as const;

export const ORDER_STATUS_LABELS = {
	ALL: "All",
	[OrderStatus.PENDING]: "Pending",
	[OrderStatus.PROCESSING]: "Processing",
	[OrderStatus.DELIVERED]: "Delivered",
	[OrderStatus.CANCELED]: "Canceled",
} as const;
