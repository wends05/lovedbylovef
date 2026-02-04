import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
	PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
	APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
	REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
	COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

interface StatusBadgeProps {
	status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
	return (
		<Badge variant="outline" className={statusColors[status]}>
			{status}
		</Badge>
	);
}
