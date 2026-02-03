import { queryOptions } from "@tanstack/react-query";
import { getAllRequests } from "../requests/server";
import { getAdminDashboardData } from "./server";

export const adminDashboardOptions = {
	getAdminDashboardData: queryOptions({
		queryKey: ["adminDashboardData"],
		queryFn: getAdminDashboardData,
	}),
	getRequests: queryOptions({
		queryKey: ["adminRequests"],
		queryFn: getAllRequests,
	}),
};
