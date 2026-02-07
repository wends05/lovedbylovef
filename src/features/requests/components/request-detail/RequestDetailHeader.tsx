import { formatDistanceToNow } from "date-fns";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type RequestDetailHeaderProps = {
	title: string;
	createdAt: Date;
	statusLabel: string;
	statusColor: string;
	statusBgColor: string;
	StatusIcon: LucideIcon;
	onBack: () => void;
};

export function RequestDetailHeader({
	title,
	createdAt,
	statusLabel,
	statusColor,
	statusBgColor,
	StatusIcon,
	onBack,
}: RequestDetailHeaderProps) {
	return (
		<div className="mb-8">
			<Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={onBack}>
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back
			</Button>

			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
					<p className="text-muted-foreground">
						Submitted{" "}
						{formatDistanceToNow(new Date(createdAt), {
							addSuffix: true,
						})}
					</p>
				</div>

				<div
					className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusBgColor}`}
				>
					<StatusIcon className={`w-5 h-5 ${statusColor}`} />
					<span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
				</div>
			</div>
		</div>
	);
}
