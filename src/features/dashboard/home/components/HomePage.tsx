import { useSuspenseQuery } from "@tanstack/react-query";
import { Heart, Package } from "lucide-react";
import { useSupabaseSession } from "@/integrations/supabase/use-session";
import { dashboardQueryOptions } from "../../options";

export default function HomePage() {
	const { data } = useSuspenseQuery(dashboardQueryOptions.getDashboardData);
	const { session } = useSupabaseSession();
	const userName =
		(session?.user.user_metadata as { name?: string } | null)?.name || "there";

	return (
		<div className="w-full">
			<h1 className="text-3xl font-bold text-foreground mb-2 font-display">
				Welcome back, {userName}!
			</h1>
			<p className="text-muted-foreground mb-8">
				Here's what's happening with your crochet orders.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Stats Card */}
				<div className="bg-card rounded-lg border border-border p-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Package className="w-6 h-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total Orders</p>
							<p className="text-2xl font-bold text-foreground">
								{data?.totalOrders ?? 0}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-card rounded-lg border border-border p-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
							<Package className="w-6 h-6 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total Requests</p>
							<p className="text-2xl font-bold text-foreground">
								{data?.totalRequests ?? 0}
							</p>
						</div>
					</div>
				</div>

				{/* Welcome Card */}
				<div className="bg-card rounded-lg border border-border p-6 md:col-span-2">
					<div className="flex items-start gap-4">
						<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
							<Heart className="w-6 h-6 text-primary-foreground" />
						</div>
						<div>
							<h2 className="font-semibold text-foreground mb-1">
								Handmade with Love
							</h2>
							<p className="text-sm text-muted-foreground">
								Welcome to your lovedbylovef dashboard! Here you can track your
								orders and manage your account. We're excited to create
								something beautiful just for you.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
