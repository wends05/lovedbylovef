import { queryOptions } from "@tanstack/react-query";
import { getAdminDashboardData } from "./server";

export const adminDashboardOptions = {
	getAdminDashboardData: queryOptions({
		queryKey: ["adminDashboardData"],
		queryFn: getAdminDashboardData,
	}),
};
