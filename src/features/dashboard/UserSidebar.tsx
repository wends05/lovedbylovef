import { Link, useRouter } from "@tanstack/react-router";
import {
	Home,
	LogOut,
	MessageCircleMore,
	Package,
	PlusIcon,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseSession } from "@/integrations/supabase/use-session";

export function UserSidebar() {
	const router = useRouter();
	const { session } = useSupabaseSession();

	const user = session?.user;
	const userName =
		(user?.user_metadata as { name?: string } | null)?.name ||
		user?.email?.split("@")[0] ||
		"User";
	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.navigate({ to: "/" });
	};

	const navigation = [
		{
			title: "Dashboard",
			icon: Home,
			href: "/dashboard",
		},
		{
			title: "Requests",
			icon: Package,
			href: "/requests",
		},
		{
			title: "Orders",
			icon: MessageCircleMore,
			href: "/orders",
		},
	];

	return (
		<Sidebar>
			<SidebarHeader className="border-b border-sidebar-border p-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
						{initials}
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium">{userName}</span>
						<span className="text-xs text-muted-foreground">{user?.email}</span>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup className="h-full">
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent className="flex flex-col justify-between h-full">
						{/* Top Area */}
						<SidebarMenu className="">
							{/* Main Navigation Pages */}
							{navigation.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton
										className="flex gap-2"
										render={
											<Link to={item.href}>
												<item.icon className="h-4 w-4 shrink-0" />
												<span className="truncate">{item.title}</span>
											</Link>
										}
									/>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
						{/* Bottom Area */}
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									className="flex gap-2"
									render={
										<Link to="/create-request">
											<PlusIcon className="h-4 w-4 shrink-0" />
											<span className="truncate">New Request</span>
										</Link>
									}
								/>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="border-t border-sidebar-border p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							onClick={handleSignOut}
							className="text-destructive hover:text-destructive hover:bg-destructive/10"
						>
							<LogOut className="h-4 w-4" />
							<span>Sign Out</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
