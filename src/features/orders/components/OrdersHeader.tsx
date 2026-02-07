import type { ReactNode } from "react";

interface OrdersHeaderProps {
	title: string;
	subtitle?: string;
	actions?: ReactNode;
}

export function OrdersHeader({ title, subtitle, actions }: OrdersHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 className="text-3xl font-bold text-foreground font-display">
					{title}
				</h1>
				{subtitle ? (
					<p className="text-muted-foreground mt-1">{subtitle}</p>
				) : null}
			</div>
			{actions ? <div className="shrink-0">{actions}</div> : null}
		</div>
	);
}
