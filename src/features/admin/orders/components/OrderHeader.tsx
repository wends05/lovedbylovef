interface OrderHeaderProps {
	totalCount: number;
}

export function OrderHeader({ totalCount }: OrderHeaderProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 className="text-3xl font-bold text-foreground font-display">
					Order Management
				</h1>
				<p className="text-muted-foreground mt-1">
					Manage and track all customer orders ({totalCount})
				</p>
			</div>
		</div>
	);
}
