"use client";

import { useRouterState } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/AdminSidebar";

interface AdminLayoutProps {
	children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const title = getAdminDashboardTitle(pathname);

	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset className="flex flex-col">
				<DashboardHeader title={title} />
				<main className="flex-1 p-6">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

function getAdminDashboardTitle(pathname: string) {
	if (pathname === "/admin/orders") return "Orders";
	if (pathname === "/admin/requests") return "Requests";
	if (pathname === "/admin/gallery" || pathname === "/admin/gallery/") {
		return "Gallery";
	}
	if (pathname === "/admin/gallery/create") return "Create Gallery Item";
	if (pathname.endsWith("/edit")) return "Edit Gallery Item";

	return "Admin Dashboard";
}
