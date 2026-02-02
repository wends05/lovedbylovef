"use client";

import { Link, useRouter } from "@tanstack/react-router";
import {
	GalleryHorizontalEnd,
	Home,
	LayoutDashboard,
	LogOut,
	Mail,
	Package,
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
import { authClient } from "@/lib/auth-client";

export function AdminSidebar() {
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const user = session?.user;
	const userName = user?.name || user?.email?.split("@")[0] || "Admin";
	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const handleSignOut = async () => {
		await authClient.signOut();
		router.navigate({ to: "/" });
	};

	const navigation = [
		{
			title: "Dashboard",
			icon: LayoutDashboard,
			href: "/admin/dashboard",
		},
		{
			title: "Orders",
			icon: Package,
			href: "/admin/orders",
		},
		{
			title: "Requests",
			icon: Mail,
			href: "/admin/requests",
		},
		{
			title: "Gallery",
			icon: GalleryHorizontalEnd,
			href: "/admin/gallery",
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
						<span className="text-xs text-muted-foreground">Administrator</span>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
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
