import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OrderStatus } from "@/generated/prisma/enums";
import { ORDER_STATUS_TABS } from "../schemas/OrderOptions";

interface OrderStatusTabsProps {
	value: keyof typeof OrderStatus | "ALL";
	onValueChange: (value: keyof typeof OrderStatus | "ALL") => void;
}

export function OrderStatusTabs({
	value,
	onValueChange,
}: OrderStatusTabsProps) {
	return (
		<>
			<div className="hidden md:block">
				<Tabs value={value} onValueChange={onValueChange}>
					<TabsList className="grid w-full grid-cols-5">
						{ORDER_STATUS_TABS.map((status) => (
							<TabsTrigger key={status.value} value={status.value}>
								{status.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			<div className="md:hidden">
				<Select
					value={value}
					onValueChange={(next) => onValueChange(next || "ALL")}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select status..." />
					</SelectTrigger>
					<SelectContent>
						{ORDER_STATUS_TABS.map((status) => (
							<SelectItem key={status.value} value={status.value}>
								{status.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</>
	);
}
