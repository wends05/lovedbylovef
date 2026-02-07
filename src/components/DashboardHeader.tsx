import { SidebarTrigger } from "@/components/ui/sidebar";

type DashboardHeaderProps = {
	title: string;
};

export function DashboardHeader({ title }: DashboardHeaderProps) {
	return (
		<header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
			<div className="flex h-14 items-center gap-3 px-4 sm:px-6">
				<SidebarTrigger />
				<h1 className="text-lg font-semibold text-foreground font-display">
					{title}
				</h1>
			</div>
		</header>
	);
}
