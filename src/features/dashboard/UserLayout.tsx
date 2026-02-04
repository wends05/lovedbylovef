"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserSidebar } from "@/features/dashboard/UserSidebar";

interface UserLayoutProps {
	children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
	return (
		<SidebarProvider>
			<UserSidebar />
			<SidebarInset className="flex flex-col">
				<main className="flex-1 p-6">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
