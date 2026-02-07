import type { ReactNode } from "react";

interface OrdersLayoutProps {
	children: ReactNode;
}

export function OrdersLayout({ children }: OrdersLayoutProps) {
	return <div className="space-y-6">{children}</div>;
}
