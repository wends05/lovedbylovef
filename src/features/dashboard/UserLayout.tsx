"use client";

import { useRouterState } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/features/dashboard/UserSidebar";

interface UserLayoutProps {
	children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const title = getUserDashboardTitle(pathname);

	return (
		<SidebarProvider>
			<UserSidebar />
			<SidebarInset className="flex flex-col">
				<DashboardHeader title={title} />
				<main className="flex-1 p-6">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

function getUserDashboardTitle(pathname: string) {
	if (pathname === "/orders") return "Orders";
	if (pathname === "/requests") return "Requests";
	if (pathname === "/create-request") return "Create Request";

	return "Dashboard";
}
